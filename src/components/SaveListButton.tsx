"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { parseFilters } from "@/lib/filters";

export function SaveListButton() {
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const filters = parseFilters(new URLSearchParams(params.toString()));
      const res = await fetch("/api/lead-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listName: name, filters }),
      });
      if (res.ok) {
        setDone(true);
        setTimeout(() => {
          setOpen(false);
          setDone(false);
          setName("");
        }, 1200);
      }
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button className="btn-secondary" onClick={() => setOpen(true)}>
        Save as list
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        autoFocus
        className="input w-56"
        placeholder="e.g. WP Roofing — no quote tool"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        className="btn-primary"
        onClick={save}
        disabled={saving || !name.trim()}
      >
        {done ? "Saved ✓" : saving ? "Saving…" : "Save"}
      </button>
      <button className="btn-secondary" onClick={() => setOpen(false)}>
        Cancel
      </button>
    </div>
  );
}
