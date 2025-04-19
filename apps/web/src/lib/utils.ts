import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 클래스 이름을 병합하고 최적화하는 유틸리티 함수
 * clsx와 tailwind-merge를 사용해 클래스 이름을 효율적으로 관리합니다.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
