import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getNote, updateNote } from "../../../lib/api";

export default function EditNote() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const data = await getNote(id);
        setTitle(data.title);
        setContent(data.content);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load note");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      await updateNote(id, { title, content });
      router.push(`/notes/${id}`);
    } catch (e: any) {
      setError(e?.message ?? "Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1 style={{ margin: 0 }}>Edit Note</h1>
        <Link className="btn ghost" href={`/notes/${id}`}>Cancel</Link>
      </div>

      <form className="card" onSubmit={onSubmit}>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "var(--color-error)" }}>{error}</p>}
        {!loading && (
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
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <Link className="btn ghost" href={`/notes/${id}`}>Discard</Link>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
