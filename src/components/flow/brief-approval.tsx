"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, ArrowRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "pending" | "approved" | "rejected";

const MANAGER = "Dana Whitfield";

export function BriefApproval() {
  const [status, setStatus] = useState<Status>("pending");
  const [showReject, setShowReject] = useState(false);
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState("");

  const pill =
    status === "approved"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : status === "rejected"
        ? "bg-rose-50 text-rose-700 ring-rose-200"
        : "bg-amber-50 text-amber-700 ring-amber-200";

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-7 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">Feedback &amp; Status</h3>
          <p className="mt-1 text-sm text-slate-600">
            Sign-off gate. Approve to unlock execution, or reject with notes to send it back for revision.
          </p>
        </div>
        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ring-1 ring-inset", pill)}>
          {status === "pending" ? "Awaiting approval" : status}
        </span>
      </div>

      {/* Pending */}
      {status === "pending" && (
        <div className="mt-5">
          {!showReject ? (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setStatus("approved")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                <Check className="h-4 w-4" /> Approve as {MANAGER}
              </button>
              <button
                onClick={() => setShowReject(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50"
              >
                <X className="h-4 w-4" /> Reject with notes
              </button>
            </div>
          ) : (
            <div>
              <label className="mb-2 block text-[13px] font-bold uppercase tracking-wide text-slate-500">Rejection notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="What needs to change before this can be approved?"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-rose-400"
              />
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => {
                    setSavedNotes(notes.trim());
                    setStatus("rejected");
                    setShowReject(false);
                  }}
                  disabled={!notes.trim()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                >
                  <X className="h-4 w-4" /> Submit rejection
                </button>
                <button onClick={() => setShowReject(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Approved */}
      {status === "approved" && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <Check className="h-4 w-4" /> Approved by {MANAGER}
          </span>
          <Link href="/tools" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            Continue to Playbooks <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Rejected */}
      {status === "rejected" && (
        <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700">
              <X className="h-4 w-4" /> Rejected by {MANAGER}
            </span>
            <button
              onClick={() => { setStatus("pending"); setNotes(savedNotes); }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reopen
            </button>
          </div>
          {savedNotes && (
            <p className="mt-3 border-t border-rose-200 pt-3 text-sm leading-relaxed text-slate-700">
              <span className="font-semibold text-rose-700">Notes:</span> {savedNotes}
            </p>
          )}
          <Link href="/diagnosis" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-rose-700 hover:underline">
            Revise in Diagnosis <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
