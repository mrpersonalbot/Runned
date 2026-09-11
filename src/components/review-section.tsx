"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Review = {
  id: string;
  rating_overall: number;
  would_buy_again: boolean;
  summary: string | null;
  body: string | null;
  created_at: string;
};

type ReviewState = {
  authenticated: boolean;
  configured: boolean;
  catalogSynced: boolean;
  reviews: Review[];
};

const dimensions = [
  ["softness", "Softness"],
  ["energy_return", "Energy return"],
  ["stability", "Stability"],
  ["fit_width", "Fit width"],
  ["toe_box", "Toe box"],
  ["heel_lockdown", "Heel lockdown"],
  ["grip", "Grip"],
  ["durability", "Durability"],
  ["breathability", "Breathability"],
  ["value", "Value"],
] as const;

const ratingOptions = [1, 2, 3, 4, 5];

export function ReviewSection({ shoeSlug }: { shoeSlug: string }) {
  const pagesPreview = process.env.NEXT_PUBLIC_GITHUB_PAGES === "1";
  const [state, setState] = useState<ReviewState>({ authenticated: false, configured: true, catalogSynced: true, reviews: [] });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadReviews() {
    setLoading(true);
    try {
      const response = await fetch(`/api/reviews?shoe=${encodeURIComponent(shoeSlug)}`, { cache: "no-store" });
      const data = await response.json();
      setState({
        authenticated: Boolean(data.authenticated),
        configured: data.configured !== false,
        catalogSynced: data.catalogSynced !== false,
        reviews: Array.isArray(data.reviews) ? data.reviews : [],
      });
    } catch {
      setState({ authenticated: false, configured: false, catalogSynced: false, reviews: [] });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (pagesPreview) {
      setLoading(false);
      setState({ authenticated: false, configured: false, catalogSynced: false, reviews: [] });
      return;
    }
    void loadReviews();
  }, [pagesPreview, shoeSlug]);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSubmitting(true);
    setMessage("");
    const form = new FormData(formElement);
    const payload: Record<string, string | number | boolean> = {
      shoe: shoeSlug,
      rating_overall: Number(form.get("rating_overall")),
      would_buy_again: form.get("would_buy_again") === "yes",
      summary: String(form.get("summary") ?? ""),
      body: String(form.get("body") ?? ""),
    };
    dimensions.forEach(([field]) => { payload[field] = Number(form.get(field)); });

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(data.error ?? "Unable to save review.");
      setSubmitting(false);
      return;
    }

    formElement.reset();
    setMessage("Review saved.");
    setSubmitting(false);
    await loadReviews();
  }

  return (
    <section className="border border-black/10 bg-white p-6 lg:p-8">
      <div className="flex flex-col gap-3 border-b border-black/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Runner reviews</p>
          <h2 className="mt-2 font-display text-3xl tracking-[-0.04em]">What members say</h2>
        </div>
        <p className="text-sm text-black/45">{loading ? "Loading…" : `${state.reviews.length} review${state.reviews.length === 1 ? "" : "s"}`}</p>
      </div>

      <div className="divide-y divide-black/10">
        {!loading && state.reviews.length === 0 && <p className="py-6 text-sm text-black/50">No member reviews yet.</p>}
        {state.reviews.map((review) => (
          <article key={review.id} className="py-6">
            <div className="flex items-center justify-between gap-4">
              <div><span className="font-display text-2xl">{Number(review.rating_overall).toFixed(1)}</span><span className="ml-1 text-sm text-black/40">/ 5</span></div>
              <span className="text-xs uppercase tracking-[0.12em] text-black/40">{review.would_buy_again ? "Would buy again" : "Would not buy again"}</span>
            </div>
            {review.summary && <h3 className="mt-3 font-semibold">{review.summary}</h3>}
            {review.body && <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60">{review.body}</p>}
            <p className="mt-3 text-xs text-black/35">Runned member · {new Date(review.created_at).toLocaleDateString("en-ID", { year: "numeric", month: "short", day: "numeric" })}</p>
          </article>
        ))}
      </div>

      <div className="mt-2 border-t border-black/10 pt-6">
        {!state.configured ? (
          <p className="text-sm text-black/50">Member reviews will activate when the database connection is enabled.</p>
        ) : !state.authenticated ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-black/55">Only signed-in Runned members can add or update a review.</p>
            <Link href="/sign-in" className="inline-flex border border-black bg-black px-4 py-2 text-sm font-semibold text-white">Sign in to review</Link>
          </div>
        ) : !state.catalogSynced ? (
          <p className="text-sm text-black/50">This shoe needs to be synced to the review database before member reviews can be submitted.</p>
        ) : (
          <form onSubmit={submitReview} className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-sm font-semibold">Add or update your review</p><p className="mt-1 text-xs text-black/45">One review per member, per shoe.</p></div>
              <label className="text-sm">Overall rating
                <select name="rating_overall" defaultValue="4" className="ml-3 border border-black/15 bg-white px-3 py-2">{ratingOptions.map((value) => <option key={value} value={value}>{value} / 5</option>)}</select>
              </label>
            </div>

            <div className="grid gap-px border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-5">
              {dimensions.map(([field, label]) => (
                <label key={field} className="bg-white p-3 text-xs font-semibold text-black/55">{label}
                  <select name={field} defaultValue="3" className="mt-2 w-full border border-black/10 bg-white px-2 py-2 text-sm text-black">{ratingOptions.map((value) => <option key={value} value={value}>{value}</option>)}</select>
                </label>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">Would you buy it again?
                <select name="would_buy_again" defaultValue="yes" className="mt-2 w-full border border-black/15 bg-white px-3 py-3 font-normal"><option value="yes">Yes</option><option value="no">No</option></select>
              </label>
              <label className="text-sm font-semibold">Short summary
                <input name="summary" maxLength={160} placeholder="What stands out?" className="mt-2 w-full border border-black/15 bg-white px-3 py-3 font-normal outline-none" />
              </label>
            </div>
            <label className="block text-sm font-semibold">Review
              <textarea name="body" maxLength={4000} rows={5} placeholder="How does it fit, feel and perform in your running?" className="mt-2 w-full resize-y border border-black/15 bg-white px-3 py-3 font-normal leading-6 outline-none" />
            </label>
            <div className="flex items-center gap-4">
              <button disabled={submitting} className="border border-black bg-black px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{submitting ? "Saving…" : "Save review"}</button>
              {message && <p className="text-sm text-black/55">{message}</p>}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
