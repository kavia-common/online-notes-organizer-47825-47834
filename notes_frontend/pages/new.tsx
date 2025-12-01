import { useRouter } from "next/router";
import { useState } from "react";
import { createNote } from "../lib/api";
import Link from "next/link";

export default function NewNote() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const note = await createNote({ title, content });
      router.push(`/notes/${note.id}`);
    } catch (e: any) {
      setError(e?.message ?? "Failed to create note");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1 style={{ margin: 0 }}>New Note</h1>
        <Link className="btn ghost" href="/">Back</Link>
      </div>

      <form className="card" onSubmit={onSubmit}>
        {error && <p style={{ color: "var(--color-error)" }}>{error}</p>}
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <label style={{ display: "block", marginBottom: 6 }}>Title</label>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 6 }}>Content</label>
            <textarea className="textarea" value={content} onChange={e => setContent(e.target.value)} required />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn primary" type="submit" disabled={saving}>
              {saving ? "Creating..." : "Create"}
            </button>
            <Link className="btn ghost" href="/">Cancel</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
