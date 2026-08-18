export function formatIDR(value) {
  if (value == null) return "Price pending";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPace(secondsPerKm) {
  if (secondsPerKm == null || secondsPerKm <= 0) return "—";
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}/km`;
}

export function confidenceScore(reviewCount) {
  if (!Number.isFinite(reviewCount) || reviewCount <= 0) return 0;
  return Math.min(100, Math.round(25 * Math.log10(reviewCount + 1) + 25));
}

export function runnerMatchScore({ runner, shoe }) {
  let score = 70;

  if (runner.goal && shoe.useCases?.some((useCase) => useCase.toLowerCase().includes(runner.goal.toLowerCase()))) {
    score += 12;
  }

  if (runner.prefersSoft && shoe.community?.softness >= 4) score += 8;
  if (runner.needsStability && shoe.community?.stability >= 4) score += 8;
  if (runner.wideFoot && shoe.community?.fitWidth >= 3.5) score += 6;
  if (runner.wideFoot && shoe.community?.fitWidth < 2.5) score -= 10;

  return Math.max(0, Math.min(99, Math.round(score)));
}
