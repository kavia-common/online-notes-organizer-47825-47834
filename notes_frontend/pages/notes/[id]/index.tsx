import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getNote, deleteNote, Note } from "../../../lib/api";

export default function NoteView() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const data = await getNote(id);
        setNote(data);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load note");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onDelete = async () => {
    if (!id) return;
    if (!confirm("Delete this note?")) return;
    try {
      await deleteNote(id);
      router.push("/");
    } catch (e: any) {
      alert(e?.message ?? "Failed to delete");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1 style={{ margin: 0 }}>Note</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <Link className="btn ghost" href="/">Back</Link>
          {id && <Link className="btn secondary" href={`/notes/${id}/edit`}>Edit</Link>}
          <button className="btn danger" onClick={onDelete}>Delete</button>
        </div>
      </div>

      <div className="card">
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "var(--color-error)" }}>{error}</p>}
        {note && (
          <div style={{ display: "grid", gap: 8 }}>
            <h2 style={{ margin: "0 0 8px 0" }}>{note.title}</h2>
            <div style={{ color: "#6b7280", fontSize: 12 }}>
              Updated {new Date(note.updated_at).toLocaleString()}
            </div>
            <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
              {note.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
