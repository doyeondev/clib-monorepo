/**
 * 날짜를 형식화하는 유틸리티 함수
 * @param date - 형식화할 Date 객체
 * @param format - 'short' | 'long' | 'full' 형식 옵션
 * @returns 형식화된 날짜 문자열
 */
export const formatDate = (date: Date, format: 'short' | 'long' | 'full' = 'short'): string => {
	try {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');

		switch (format) {
			case 'short':
				return `${year}.${month}.${day}`;
			case 'long':
				return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
			case 'full':
				return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`;
			default:
				return `${year}.${month}.${day}`;
		}
	} catch (error) {
		console.error('날짜 형식화 오류:', error);
		return '';
	}
};
