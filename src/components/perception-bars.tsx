import type { CommunityPerception } from "@/lib/types";

const labels: Array<[keyof CommunityPerception, string, string, string]> = [
  ["softness", "Cushion", "Firm", "Soft"],
  ["energyReturn", "Energy return", "Flat", "Bouncy"],
  ["stability", "Stability", "Unstable", "Stable"],
  ["fitWidth", "Fit", "Narrow", "Wide"],
  ["toeBox", "Toe box", "Tight", "Roomy"],
  ["heelLockdown", "Heel lockdown", "Loose", "Secure"],
  ["grip", "Grip", "Poor", "Excellent"],
  ["breathability", "Breathability", "Hot", "Airy"],
];

export function PerceptionBars({ values }: { values: CommunityPerception }) {
  return <div className="grid gap-5 sm:grid-cols-2">{labels.map(([key, label, low, high]) => {
    const value = values[key];
    return <div key={key}>
      <div className="mb-2 flex items-center justify-between text-sm"><span className="font-semibold">{label}</span><span className="font-black">{value.toFixed(1)}</span></div>
      <div className="h-2 overflow-hidden rounded-full bg-black/8"><div className="h-full rounded-full bg-black" style={{ width: `${value * 20}%` }} /></div>
      <div className="mt-1 flex justify-between text-[11px] text-black/40"><span>{low}</span><span>{high}</span></div>
    </div>;
  })}</div>;
}
