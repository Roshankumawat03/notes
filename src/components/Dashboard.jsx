import { useState, useEffect } from "react";
import { openDB } from "idb";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./dashboard.css";
import "./Archive";


export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  const handleToggle = () => {
    window.innerWidth <= 768
      ? setMobileOpen(!mobileOpen)
      : setCollapsed(!collapsed);
  };

  const dbPromise = openDB("notesDb", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("notes")) {
        db.createObjectStore("notes", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });

  useEffect(() => {
    dbPromise.then((db) =>
      db.getAll("notes").then((data) => setNotes(data))
    );
  }, []);

  const handleSubmit = async () => {
    if (!title && !note) return;

    const newNote = {
      title,
      note,
      time: new Date().toLocaleString(),
      isDeleted: false,
      isArchive: false,
    };

    const db = await dbPromise;
    const id = await db.add("notes", newNote);

    setNotes([...notes, { ...newNote, id }]);

    setTitle("");
    setNote("");
  };

  return (
    <div className="dashboard-container">
      <Header onToggle={handleToggle} />

      <div className="dashboard-wrapper">
        <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} />

        

        <main className="dashboard-content ms-5">
          <div className="note-box p-4">
            <textarea
              className="form-control mb-2"
              placeholder="Take a Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="form-control mb-2"
              placeholder="Take a Note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <button className="btn btn-dark w-100" onClick={handleSubmit}>
              Submit
            </button>
          </div>

         
        </main>
      </div>
    </div>
  );
}



