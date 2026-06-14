"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteListButton({ id }: { id: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!confirm("Delete this saved list?")) return;
    setBusy(true);
    await fetch(`/api/lead-lists/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      onClick={remove}
      disabled={busy}
      className="text-xs text-slate-400 hover:text-red-600"
    >
      Delete
    </button>
  );
}
