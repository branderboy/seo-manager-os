"use client";

import { useState } from "react";
import { Check, X, RotateCcw, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "pending" | "approved" | "rejected";

const MANAGER = "Dana Whitfield";

export function BriefApproval() {
  const [status, setStatus] = useState<Status>("pending");
  const [showReject, setShowReject] = useState(false);
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState("");
  const [launched, setLaunched] = useState(false);

  const statusPill =
    launched
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : status === "approved"
        ? "bg-blue-50 text-blue-700 ring-blue-200"
        : status === "rejected"
          ? "bg-rose-50 text-rose-700 ring-rose-200"
          : "bg-amber-50 text-amber-700 ring-amber-200";

  const statusText = launched ? "Active project" : status === "pending" ? "Awaiting approval" : status;

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-7 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">Feedback &amp; Status</h3>
          <p className="mt-1 text-sm text-slate-600">Approve or reject the brief, then launch to make the project active.</p>
        </div>
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase ring-1 ring-inset", statusPill)}>
          {launched && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
          {statusText}
        </span>
      </div>

      {/* Approval */}
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
              <label className="mb-2 block text-[13px] font-bold uppercase tracking-wide text-slate-500">Feedback notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="What needs to change before this can be approved?"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-rose-400"
              />
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => { setSavedNotes(notes.trim()); setStatus("rejected"); setShowReject(false); }}
                  disabled={!notes.trim()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                >
                  <X className="h-4 w-4" /> Submit rejection
                </button>
                <button onClick={() => setShowReject(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50">Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {status === "rejected" && (
        <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700"><X className="h-4 w-4" /> Rejected by {MANAGER}</span>
            <button onClick={() => { setStatus("pending"); setNotes(savedNotes); }} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              <RotateCcw className="h-3.5 w-3.5" /> Reopen
            </button>
          </div>
          {savedNotes && <p className="mt-3 border-t border-rose-200 pt-3 text-sm leading-relaxed text-slate-700"><span className="font-semibold text-rose-700">Notes:</span> {savedNotes}</p>}
        </div>
      )}

      {/* Launch (after approval) */}
      {status === "approved" && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg", launched ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-500")}>
              <Rocket className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-semibold text-slate-900">{launched ? "Project launched" : "Launch project"}</div>
              <div className="text-xs text-slate-500">
                {launched ? "Execution is live — Playbooks and Daily Tasks are active." : `Approved by ${MANAGER}. Flip to launch.`}
              </div>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={launched}
            onClick={() => setLaunched((v) => !v)}
            className={cn("relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors", launched ? "bg-emerald-500" : "bg-slate-300")}
          >
            <span className={cn("inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform", launched ? "translate-x-6" : "translate-x-1")} />
          </button>
        </div>
      )}
    </div>
  );
}
