import Link from "next/link";
import { useEffect, useState } from "react";
import { listNotes, deleteNote, Note } from "../lib/api";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const data = await listNotes();
      setNotes(data);
    } catch (e: any) {
      setError(e?.message ?? "Error loading notes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this note?")) return;
    try {
      await deleteNote(id);
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (e: any) {
      alert(e?.message ?? "Failed to delete");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1 style={{ margin: 0 }}>Notes</h1>
        <Link className="btn primary" href="/new">+ New Note</Link>
      </div>

      <div className="card">
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "var(--color-error)" }}>{error}</p>}
        {!loading && notes.length === 0 && <p>No notes yet. Create your first one.</p>}
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
          {notes.map(note => (
            <li key={note.id} className="card" style={{ padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div>
                  <Link href={`/notes/${note.id}`} style={{ color: "var(--color-primary)", fontWeight: 700 }}>
                    {note.title}
                  </Link>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    Updated {new Date(note.updated_at).toLocaleString()}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link className="btn ghost" href={`/notes/${note.id}`}>View</Link>
                  <Link className="btn secondary" href={`/notes/${note.id}/edit`}>Edit</Link>
                  <button className="btn danger" onClick={() => onDelete(note.id)}>Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
