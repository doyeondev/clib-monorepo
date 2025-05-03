/**
 * DOCX 파일 처리 유틸리티
 * mammoth 라이브러리를 활용한 문서 처리 로직 통합
 */
import mammoth from 'mammoth';
import { debugLog } from './commonUtils';
import { ClauseItem, MetaData } from '../types/clib';
import { isWordDocument, getStyleMapOptions } from './documentUtils';

/**
 * 파일 확장자가 Word 문서인지 확인
 * @param file 확인할 파일
 * @returns Word 문서 여부
 */
export const isWordFile = (file: File): boolean => {
	return isWordDocument(file);
};

/**
 * DOCX 파일을 처리하여 HTML로 변환
 * @param file DOCX 파일
 * @param source 문서 출처
 * @returns 처리된 HTML 문자열
 */
export const convertDocxToHtml = async (file: File, source: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onloadend = async () => {
			try {
				const arrayBuffer = reader.result as ArrayBuffer;
				const options = getStyleMapOptions(source);

				const resultObject = (await mammoth.convertToHtml({ arrayBuffer }, options)) as unknown as { value: string; warnings: any[] };

				// 빈 p 태그 정리 (정규식을 사용해 <p></p> 제거)
				const regex = /<p><\/p>/gi;
				const cleanedHtml = resultObject.value.replace(regex, '');

				resolve(cleanedHtml);
			} catch (error) {
				debugLog('DOCX 변환 오류', error);
				reject(error);
			}
		};

		reader.onerror = error => {
			debugLog('파일 읽기 오류', error);
			reject(error);
		};

		reader.readAsArrayBuffer(file);
	});
};

/**
 * HTML 문자열을 분석하여 계약 메타데이터와 조항 추출
 * @param htmlString 분석할 HTML 문자열
 * @param source 문서 출처
 * @returns 추출된 메타데이터와 조항 배열
 */
export const parseContractHtml = (
	htmlString: string,
	source: string
): {
	metaData: MetaData;
	contractData: ClauseItem[];
	appendix: string[];
} => {
	debugLog('HTML 분석 시작');

	// 초기값 설정
	const metaData: MetaData = {
		title: '',
		partyA: '',
		partyB: '',
		purpose: '',
	};

	const appendix: string[] = [];
	let addedItems: ClauseItem[] = [];

	// HTML 파싱
	let divToAdd = `<div>${htmlString}</div>`;
	let div = new DOMParser().parseFromString(divToAdd, 'text/html');

	let divs: string[] = [];
	let noTags = ['table', 'tbody', 'tr', 'td', 'strong'];
	let items = div.getElementsByTagName('*');

	// div 래퍼를 제외하고 모든 요소 추가
	for (let i = 1; i < items.length; i++) {
		divs.push(items[i].outerHTML);
	}
	divs = divs.reverse();

	let list: any[] = [];
	let subList: any[] = [];
	let table: any[] = [];
	let row: any[] = [];

	// HTML 요소 분석
	for (let i = 0; i < divs.length; i++) {
		let nextDoc, nextText, nextTagName;
		let doc = new DOMParser().parseFromString(divs[i], 'text/html');
		const firstChild = doc.body.firstChild as Element;

		if (!firstChild) continue;

		let text = firstChild.textContent || '';
		let tagName = firstChild.tagName.toLowerCase();
		let className = firstChild.className || '';

		if (i + 1 < divs.length) {
			nextDoc = new DOMParser().parseFromString(divs[i + 1], 'text/html');
			const nextFirstChild = nextDoc.body.firstChild as Element;
			nextText = nextFirstChild ? nextFirstChild.textContent || '' : '';
			nextTagName = nextFirstChild ? nextFirstChild.tagName.toLowerCase() : '';
		}

		const hasText = text.length !== 0;
		// 이미 추가된 항목인지 확인
		const alreadyAdded = addedItems.some(item => typeof item.text === 'string' && item.text.trim() === text.trim());

		if (hasText && !alreadyAdded) {
			if (tagName === 'li') {
				if (className === 'two') {
					subList.push({
						tag: tagName,
						depth: className,
						text: text,
					});
				} else if (className === 'one') {
					list.push({
						tag: tagName,
						depth: className,
						text: text,
						subText: [...subList].reverse(),
					});
					subList = [];
				}
			} else if (tagName === 'ol') {
				addedItems.push({
					idx: 0,
					tag: tagName,
					text: [...list].reverse(),
				});
				list = [];
			} else if (tagName === 'span') {
				if (className === 'party1') {
					metaData.partyA = text;
				} else if (className === 'party2') {
					metaData.partyB = text;
				} else if (className === 'purpose') {
					metaData.purpose = text;
				} else if (className && className.includes('annex')) {
					appendix.push(text);
				} else {
					addedItems.push({
						idx: 0,
						tag: tagName,
						type: className,
						text: text,
					});
				}
			} else if (tagName === 'h2') {
				if (source === '리걸인사이트' && text.includes('[') && text.includes(']')) {
					const cleanedText = text.substring(text.indexOf('[') + 1, text.lastIndexOf(']'));
					addedItems.push({
						idx: 0,
						tag: tagName,
						text: cleanedText,
					});
				} else {
					addedItems.push({
						idx: 0,
						tag: tagName,
						text: text,
					});
				}
			} else if (tagName === 'h1') {
				// h1 태그는 계약서 제목으로 처리
				metaData.title = text;
				addedItems.push({
					idx: 0,
					tag: tagName,
					text: text,
				});
			} else {
				if (nextTagName === 'td') {
					row.push({
						tag: tagName,
						text: text,
					});
				} else if (nextTagName === 'tr') {
					table.push([...row].reverse());
					row = [];
				} else if (tagName === 'table') {
					table = [];
				} else if (!noTags.includes(tagName)) {
					addedItems.push({
						idx: 0,
						tag: tagName,
						text: text,
					});

					if (source === '리걸인사이트' && className === 'opening') {
						addedItems.push({
							idx: 0,
							tag: 'br',
							_id: String(Math.floor(Math.random() * 10000000000)),
							html: '<br/>',
							text: '',
						});
					}
				}
			}
		} else if (tagName === 'br' && tagName !== nextTagName) {
			addedItems.push({
				idx: 0,
				tag: tagName,
				text: '',
			});
		}
	}

	// 항목 순서 뒤집기
	let contractData = addedItems.reverse();

	// 항목 ID 할당 및 idx 설정
	let idx = 0;
	for (let i = 0; i < contractData.length; i++) {
		contractData[i]._id = String(Math.floor(Math.random() * 10000000000));
		if (contractData[i].tag === 'h2') {
			idx++;
		}
		contractData[i].idx = idx;
	}

	debugLog('계약 데이터 분석 완료', {
		metaDataCount: Object.keys(metaData).length,
		clauseCount: contractData.length,
		appendixCount: appendix.length,
	});

	return {
		metaData,
		contractData,
		appendix,
	};
};

/**
 * 조항 배열을 ID를 기준으로 그룹화
 * @param contractData 조항 데이터 배열
 * @returns 그룹화된 조항 배열
 */
export const groupContractData = (contractData: ClauseItem[]): ClauseItem[][] => {
	let currentIdx = 0;
	let contractList: ClauseItem[][] = [];
	let contractItem: ClauseItem[] = [];

	// idx 값을 기준으로 항목들을 그룹화
	for (let i = 0; i < contractData.length; i++) {
		if (contractData[i].idx === currentIdx) {
			contractItem.push(contractData[i]);
		} else {
			contractList.push(contractItem);
			contractItem = [];
			contractItem.push(contractData[i]);
			currentIdx = (contractData[i].idx || 0) + 1;
		}

		if (i === contractData.length - 1) {
			contractList.push(contractItem);
		}
	}

	debugLog('그룹화된 배열 생성 완료', contractList.length);

	return contractList;
};

/**
 * 조항 데이터에 기반하여 HTML 생성
 * @param clauseArray 조항 배열
 * @returns HTML이 추가된 조항 배열
 */
export const generateClauseHtml = (clauseArray: ClauseItem[]): ClauseItem[] => {
	// 각 항목에 HTML 생성
	for (let i = 0; i < clauseArray.length; i++) {
		const item = clauseArray[i];
		const tag = item.tag;

		// HTML 생성 로직
		if (tag === 'br') {
			// 연속된 br 태그 처리
			if (i + 1 < clauseArray.length && clauseArray[i + 1].tag !== 'br') {
				item.html = '<br/>';
			} else {
				item.html = '';
			}
		} else if ((tag === 'ol' || tag === 'ul') && item.text) {
			// 리스트 처리
			const textArray = item.text;
			if (Array.isArray(textArray)) {
				let listHtml = '';

				for (let k = 0; k < textArray.length; k++) {
					const listItem = textArray[k];
					if (listItem && listItem.tag) {
						let sublistHtml = '';

						// 서브리스트 처리
						if (listItem.subText && listItem.subText.length > 0) {
							for (let x = 0; x < listItem.subText.length; x++) {
								const subItem = listItem.subText[x];
								if (subItem && subItem.tag) {
									const subItemId = String(Math.floor(Math.random() * 10000000000));
									sublistHtml += `<${subItem.tag} name='level-two-item' class='level-two-item' id=${subItemId}>${subItem.text || ''}</${subItem.tag}>`;
								}
							}

							if (sublistHtml) {
								sublistHtml = `<ol name='level-two-list' class='level-two-list list-[upper-roman]'>${sublistHtml}</ol>`;
							}
						}

						const itemId = String(Math.floor(Math.random() * 10000000000));
						listHtml += `<${listItem.tag} name='level-one-item' class='level-one-item' id=${itemId}>${listItem.text || ''}${sublistHtml}</${listItem.tag}>`;
					}
				}

				const listId = item._id || String(Math.floor(Math.random() * 10000000000));
				item.html = `<${tag} name='level-one-list' class='level-one-list' id=${listId}>${listHtml}</${tag}>`;
			}
		} else {
			// 일반 요소 HTML 생성
			item.html = `<${tag}>${item.text || ''}</${tag}>`;
		}
	}

	return clauseArray;
};

/**
 * 그룹화된 조항 데이터로부터 미리보기 데이터를 생성
 * @param groups 그룹화된 조항 배열
 * @returns 미리보기용 데이터 객체
 */
export const generatePreviewData = (groups: ClauseItem[][]): any[] => {
	if (!groups || !Array.isArray(groups) || groups.length === 0) {
		return [];
	}

	// 각 그룹에서 미리보기 데이터 생성
	return groups.map(items => {
		const titleItem = items.find((item: ClauseItem) => item.tag === 'h2');
		const title = titleItem ? (typeof titleItem.text === 'string' ? titleItem.text : '제목 없음') : '제목 없음';

		// 본문 HTML 구성
		let contentHtml = '';
		items.forEach((item: ClauseItem) => {
			if (item.html) {
				contentHtml += item.html;
			}
		});

		return {
			title,
			contentHtml,
			items,
		};
	});
};
