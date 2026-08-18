export function formatIDR(value: number | null): string;
export function formatPace(secondsPerKm: number | null): string;
export function confidenceScore(reviewCount: number): number;
export function runnerMatchScore(args: {
  runner: { goal?: string; prefersSoft?: boolean; needsStability?: boolean; wideFoot?: boolean };
  shoe: { useCases?: string[]; community?: { softness: number; stability: number; fitWidth: number } };
}): number;
