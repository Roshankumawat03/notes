import Header from "./Header";
import Sidebar from "./Sidebar";
import { MdOutlinePushPin } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoMdArchive } from "react-icons/io";
import { useEffect, useState } from "react";
import { openDB } from "idb";

export default function Pinned() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    openDB("notesDb", 1).then((db) =>
      db.getAll("notes").then((data) => {
        const pinnedNotes = data.filter(
          (note) =>
            note.isPinned === true &&
            note.isDeleted !== true &&
            note.isArchive !== true
        );
        setNotes(pinnedNotes);
      })
    );
  }, []);

  const unpinHandle = async (id) => {
    const db = await openDB("notesDb", 1);
    const tx = db.transaction("notes", "readwrite");
    const store = tx.objectStore("notes");

    const note = await store.get(id);
    note.isPinned = false;

    await store.put(note);
    await tx.done;

    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="dashboard-container">
      <Header />

      <div className="dashboard-wrapper">
        <Sidebar />

        <div className="container py-4">
          <div className="row">
            {notes.map((note) => (
              <div className="col-md-4 mb-3" key={note.id}>
                <div className="card shadow-sm p-3">
                  <h5>{note.title}</h5>
                  <p>{note.note}</p>
                  <p>{note.time}</p>

                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-dark" onClick={() => unpinHandle(note.id)}><MdOutlinePushPin /></button>
                  </div>
                </div>
              </div>
            ))}

            {notes.length === 0 && (
              <p className="text-muted">No pinned notes</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
