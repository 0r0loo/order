import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn (className) 함수
 * clsx와 tailwind-merge를 결합하여 조건부 클래스명과 Tailwind 클래스 충돌을 해결
 *
 * @param inputs - 클래스명 값들 (문자열, 객체, 배열 등)
 * @returns 최적화된 클래스명 문자열
 *
 * @example
 * cn("text-red-500", "bg-blue-500") // "text-red-500 bg-blue-500"
 * cn("text-red-500", { "bg-blue-500": true }) // "text-red-500 bg-blue-500"
 * cn("text-red-500", "text-blue-500") // "text-blue-500" (충돌 해결)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
