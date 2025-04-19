import mammoth from 'mammoth';

// mammoth Result 타입 정의
interface MammothResult {
	value: string;
	warnings: any[];
}

export interface ClauseItem {
	title?: string;
	content?: string;
	contentHtml?: string;
	index?: number;
	tag?: string;
	depth?: string;
	text?: string | any[];
	subText?: any[];
	type?: string;
	idx?: number | string;
	_id?: string;
	html?: string;
}

/**
 * DOCX 또는 DOC 파일을 HTML로 변환합니다.
 * @param file - 업로드된 DOCX 또는 DOC 파일
 * @param styleMapOptions - 스타일 맵 옵션 (선택적)
 * @returns HTML 변환 결과 객체
 */
export async function convertDocxToHtml(file: File, styleMapOptions?: any): Promise<any> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = async e => {
			try {
				if (!e.target) {
					throw new Error('파일 읽기 실패');
				}

				const arrayBuffer = e.target.result as ArrayBuffer;
				const options = styleMapOptions || {
					styleMap: [
						"p[style-name='체결일'] => span.date:fresh",
						"p[style-name='목적'] => span.purpose:fresh",
						"p[style-name='당사자1'] => span.party1:fresh",
						"p[style-name='당사자2'] => span.party2:fresh",
						"p[style-name='서문'] => p.opening:fresh",
						"p[style-name='끝문장'] => span.closing:fresh",
						"p[style-name='첨부1'] => span.annex1:fresh",
						"p[style-name='첨부2'] => span.annex2:fresh",
						"p[style-name='첨부3'] => span.annex3:fresh",
						"p[style-name='첨부4'] => span.annex4:fresh",
						"p[style-name='첨부5'] => span.annex5:fresh",
						"p[style-name='첨부6'] => span.annex6:fresh",
					],
					ignoreEmptyParagraphs: false,
				};

				// 타입 문제를 피하기 위해 unknown으로 먼저 캐스팅
				const result = (await mammoth.convertToHtml({ arrayBuffer }, options)) as unknown as MammothResult;
				const regex = /<p><\/p>/gi;
				const cleanHtml = result.value.replace(regex, '');

				resolve({
					html: cleanHtml,
					warnings: result.warnings,
				});
			} catch (error) {
				console.error('문서 변환 중 오류 발생:', error);
				reject(error);
			}
		};

		reader.onerror = error => reject(error);
		reader.readAsArrayBuffer(file);
	});
}

/**
 * 파일이 지원되는 워드 문서인지 확인합니다.
 * @param file - 확인할 파일
 * @returns 지원 여부
 */
export function isWordDocument(file: File): boolean {
	const allowedTypes = [
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
		'application/msword', // .doc
	];
	return allowedTypes.includes(file.type);
}

/**
 * HTML을 조항 단위로 파싱합니다.
 * @param html - DOCX에서 변환된 HTML 문자열
 * @param source - 문서 소스 (선택적)
 * @returns 파싱된 데이터 객체
 */
export function parseHtmlToClauses(html: string, source?: string): any {
	// 기본 클러스 배열 (이전 구현과 호환성 유지)
	const clauses: ClauseItem[] = [];
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');

	// 제목은 h1, h2 등으로 구분되어 있다고 가정
	const headings = doc.querySelectorAll('h1, h2, h3');

	headings.forEach((heading, index) => {
		const title = heading.textContent || `조항 ${index + 1}`;
		let content = '';
		let contentHtml = '';
		let currentNode = heading.nextElementSibling;

		// 다음 제목까지의 내용을 조항으로 간주
		while (currentNode && !['H1', 'H2', 'H3'].includes(currentNode.tagName)) {
			contentHtml += currentNode.outerHTML || '';
			content += currentNode.textContent || '';
			currentNode = currentNode.nextElementSibling;
		}

		clauses.push({
			title,
			content,
			contentHtml,
			index: index + 1,
		});
	});

	// 새로운 구현: 확장된 데이터 추출
	const addedItems: ClauseItem[] = [];
	const annexArray: string[] = [];
	const metaData: any = {};

	// HTML 파싱
	const divToAdd = `<div>${html}</div>`;
	const divDoc = parser.parseFromString(divToAdd, 'text/html');

	const items = divDoc.getElementsByTagName('*');
	const divs: string[] = [];

	// div 래퍼를 제외하고 모든 요소 추가
	for (let i = 1; i < items.length; i++) {
		divs.push(items[i].outerHTML);
	}

	// 역순으로 처리
	const reversedDivs = [...divs].reverse();

	// 처리 변수들
	let list: any[] = [];
	let subList: any[] = [];
	let table: any[] = [];
	let row: any[] = [];

	// 태그 무시 목록
	const noTags = ['table', 'tbody', 'tr', 'td', 'strong'];

	// 각 요소 처리
	for (let i = 0; i < reversedDivs.length; i++) {
		let nextDoc, nextText, nextTagName;
		const elemDoc = parser.parseFromString(reversedDivs[i], 'text/html');
		const firstChild = elemDoc.body.firstChild as Element;
		if (!firstChild) continue;

		const text = firstChild.textContent || '';
		const tagName = firstChild.tagName.toLowerCase();
		const className = firstChild.className || '';

		// 다음 요소 확인
		if (i + 1 < reversedDivs.length) {
			nextDoc = parser.parseFromString(reversedDivs[i + 1], 'text/html');
			const nextFirstChild = nextDoc.body.firstChild as Element;
			nextText = nextFirstChild ? nextFirstChild.textContent || '' : '';
			nextTagName = nextFirstChild ? nextFirstChild.tagName.toLowerCase() : '';
		}

		const hasText = text.length > 0;
		// 이미 추가된 항목인지 확인
		const alreadyAdded = addedItems.some(item => typeof item.text === 'string' && item.text.trim() === text.trim());

		if (hasText && !alreadyAdded) {
			if (tagName === 'li') {
				// 리스트 아이템 처리
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
				// OL 태그 처리
				addedItems.push({
					idx: 0,
					tag: tagName,
					text: [...list].reverse(),
				});
				list = [];
			} else if (tagName === 'span') {
				// 메타데이터 추출
				if (className === 'party1') {
					metaData.partyA = text;
				} else if (className === 'party2') {
					metaData.partyB = text;
				} else if (className === 'purpose') {
					metaData.purpose = text;
				} else if (className && className.includes('annex')) {
					annexArray.push(text);
				} else {
					addedItems.push({
						idx: 0,
						tag: tagName,
						type: className,
						text: text,
					});
				}
			} else if (tagName === 'h2') {
				// 제목 처리
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
				// 기타 태그 처리
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

					// 리걸인사이트 opening 클래스 다음에 br 태그 추가
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
			// BR 태그 처리
			addedItems.push({
				idx: 0,
				tag: tagName,
				text: '',
			});
		}
	}

	// 항목 ID 할당 및 idx 설정
	let idx = 0;
	addedItems.reverse();

	for (let i = 0; i < addedItems.length; i++) {
		addedItems[i]._id = String(Math.floor(Math.random() * 10000000000));
		if (addedItems[i].tag === 'h2') {
			idx++;
		}
		addedItems[i].idx = idx;
	}

	// HTML 생성
	generateHtml(addedItems);

	// 그룹화된 배열 생성
	const groupedArray = groupContentItems(addedItems);

	// 제목 처리
	if (!metaData.title && addedItems.length > 0) {
		const titleItem = addedItems.find(item => item.tag === 'h1');
		if (titleItem) {
			metaData.title = typeof titleItem.text === 'string' ? titleItem.text : '';
		}
	}

	// 하이라이트 텍스트 추출
	const highlightedText = extractHighlightedText(html);

	// 최종 결과 객체
	return {
		metaData,
		contentArray: addedItems,
		groupedArray,
		appendix: annexArray,
		clauseArray: addedItems.filter(item => item.tag === 'h2'),
		html: html,
		highlightedText: highlightedText,
	};
}

/**
 * 하이라이트된 텍스트 추출
 * @param html HTML 문자열
 * @returns 하이라이트된 텍스트 배열
 */
export function extractHighlightedText(html: string): any[] {
	const result: any[] = [];

	try {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');

		// 스팬 요소 검색
		const spans = doc.querySelectorAll('span[style*="color"]');
		spans.forEach(span => {
			const style = span.getAttribute('style') || '';
			const text = span.textContent || '';
			let color = '';

			if (style.includes('#0070c0') || style.toLowerCase().includes('blue')) {
				color = 'blue';
			} else if (style.includes('#ff0000') || style.toLowerCase().includes('red')) {
				color = 'red';
			} else if (style.includes('#7030a0') || style.toLowerCase().includes('purple')) {
				color = 'purple';
			}

			if (color && text) {
				result.push({ text, color });
			}
		});

		// 리스트 요소 검색
		const listItems = doc.querySelectorAll('li[style*="color"]');
		listItems.forEach(li => {
			const style = li.getAttribute('style') || '';
			const text = li.textContent || '';
			let color = '';

			if (style.includes('#0070c0') || style.toLowerCase().includes('blue')) {
				color = 'blue';
			} else if (style.includes('#ff0000') || style.toLowerCase().includes('red')) {
				color = 'red';
			} else if (style.includes('#7030a0') || style.toLowerCase().includes('purple')) {
				color = 'purple';
			}

			if (color && text) {
				result.push({ text, color });
			}
		});
	} catch (error) {
		console.error('하이라이트 텍스트 추출 오류:', error);
	}

	return result;
}

/**
 * HTML 생성
 * @param clauseArray 조항 배열
 */
function generateHtml(clauseArray: ClauseItem[]): void {
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
}

/**
 * 항목을 idx 값으로 그룹화
 * @param contentArray 컨텐츠 배열
 * @returns 그룹화된 배열
 */
function groupContentItems(contentArray: ClauseItem[]): any[][] {
	// idx 값으로 그룹화
	const groupMap: { [key: number]: any[] } = {};

	for (const item of contentArray) {
		const idx = item.idx as number;
		if (!groupMap[idx]) {
			groupMap[idx] = [];
		}
		groupMap[idx].push(item);
	}

	// 그룹화된 결과를 idx 순서로 배열 변환
	const sortedKeys = Object.keys(groupMap)
		.map(Number)
		.sort((a, b) => a - b);
	const groupedArray: any[][] = [];

	for (const key of sortedKeys) {
		groupedArray.push(groupMap[key]);
	}

	return groupedArray;
}

/**
 * 조항 내용에서 키워드를 검색합니다.
 * @param clauses - 검색할 조항 목록
 * @param keyword - 검색 키워드
 * @returns 필터링된 조항 목록
 */
export function searchInClauses(clauses: ClauseItem[], keyword: string): ClauseItem[] {
	if (!keyword) return clauses;

	const lowerKeyword = keyword.toLowerCase();
	return clauses.filter(clause => (clause.title && clause.title.toLowerCase().includes(lowerKeyword)) || (clause.content && clause.content.toLowerCase().includes(lowerKeyword)));
}

/**
 * 소스에 따른 스타일맵 옵션 가져오기
 * @param source 문서 소스
 * @returns 스타일맵 옵션
 */
export function getStyleMapOptions(source: string): any {
	if (source === '엘지') {
		return {
			styleMap: [
				"p[style-name='TITLE'] => h1.title:fresh",
				"p[style-name='제목1'] => h11.title:fresh",
				"p[style-name='제1조'] => h2.title:fresh",
				"p[style-name='제1.1조'] => ol.level-one > li.one:fresh",
				"p[style-name='(가)'] => ol.level-one > li.two:fresh",
				"p[style-name='CONTENTS'] => p.contents:fresh",
				"p[style-name='체결일'] => span.date:fresh",
				"p[style-name='목적'] => span.purpose:fresh",
				"p[style-name='당사자1'] => span.party1:fresh",
				"p[style-name='당사자2'] => span.party2:fresh",
				"p[style-name='서문'] => p.opening:fresh",
				"p[style-name='다음'] => span.next:fresh",
				"p[style-name='끝문장'] => span.closing:fresh",
				"p[style-name='첨부1'] => span.annex1:fresh",
				"p[style-name='첨부2'] => span.annex2:fresh",
				"p[style-name='첨부3'] => span.annex3:fresh",
				"p[style-name='첨부4'] => span.annex4:fresh",
				"p[style-name='첨부5'] => span.annex5:fresh",
				"p[style-name='첨부6'] => span.annex6:fresh",
				'p.highlight => ol.level-one > li.level-one-item > ol.level-two > li.level-two-item > span.mark-up:fresh',
				'comment-reference => sup',
				"p[style-name='표준'] => h4.heading-side:fresh",
			],
			ignoreEmptyParagraphs: false,
		};
	} else {
		// 리걸인사이트 등 기본값
		return {
			styleMap: [
				"p[style-name='목적'] => span.purpose:fresh",
				"p[style-name='당사자1'] => span.party1:fresh",
				"p[style-name='당사자2'] => span.party2:fresh",
				"p[style-name='끝문장'] => span.closing:fresh",
				"p[style-name='체결일'] => span.date:fresh",
				"p[style-name='첨부1'] => span.annex1:fresh",
				"p[style-name='첨부2'] => span.annex2:fresh",
				"p[style-name='첨부3'] => span.annex3:fresh",
				"p[style-name='첨부4'] => span.annex4:fresh",
				"p[style-name='첨부5'] => span.annex5:fresh",
				"p[style-name='첨부6'] => span.annex6:fresh",
				"p[style-name='제목1'] => h6.title:fresh",
				"p[style-name='제목 2'] => h3.title:fresh",
				"p[style-name='표준'] => h4:fresh",
				"p[style-name='list'] => ol > li > p:fresh",
			],
			ignoreEmptyParagraphs: false,
		};
	}
}
