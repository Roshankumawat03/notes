import Header from "./Header";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";
import { IoMdArchive } from "react-icons/io";
import { FaRegTrashCan } from "react-icons/fa6";
// import "./allnotes.css"; // Optional CSS file
import { FaEdit } from "react-icons/fa";
import { MdIncompleteCircle } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import { useEffect, useState } from "react";
import { openDB } from "idb";

export default function Bin() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [binNotes, setBinNotes] = useState([]);
  
    const handleToggle = () => {
        if (window.innerWidth <= 768) {
            setMobileOpen(!mobileOpen);
        } else {
            setCollapsed(!collapsed);
        }
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


    const trashActionPopup = async (note) => {
  const result = await Swal.fire({
    title: "Trash Options",
    text: "What do you want to do with this note?",
    icon: "warning",
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: "Restore",
    denyButtonText: "Delete Forever",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#198754", // green
    denyButtonColor: "#dc3545",    // red
  });

  const db = await openDB("notesDb", 1);
  const tx = db.transaction("notes", "readwrite");
  const store = tx.objectStore("notes");

  if (result.isConfirmed) {
    // 🔄 Restore
    const noteData = await store.get(note.id);
    noteData.isDeleted = false;
    noteData.isArchived = false;
    await store.put(noteData);

    setBinNotes((prev) => prev.filter((n) => n.id !== note.id));

    Swal.fire("Restored!", "Note restored successfully", "success");
  }

  if (result.isDenied) {
    // ❌ Delete Forever
    await store.delete(note.id);

    setBinNotes((prev) => prev.filter((n) => n.id !== note.id));

    Swal.fire("Deleted!", "Note permanently deleted", "error");
  }
};


    
      useEffect(() => {
        dbPromise.then((db) =>
          db.getAll("notes").then((data) => {
            const deleteNotes = data.filter((note)=> note.isDeleted === true);
            setBinNotes(deleteNotes);
          })
        );
      }, []);
      

   

    return (
        <div className="dashboard-container">
            <Header onToggle={handleToggle} />

            <div className="dashboard-wrapper">
                <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} />
                <div className="container py-4">
                 
                        <div className="row">
                           
                               {
                                binNotes.map((element)=>{
                                    return(
                                        <>
                                         <div className="col-md-4 mb-3">
                                    <div className="card shadow-sm p-3">
                                        <div><i className="badge text-bg-danger rounded-5 text-danger"></i></div>
                                        <h5 className="card-title">{element.title}</h5>
                                        <p className="card-text">{element.note}</p>
                                        <p className="card-text">{element.time}</p>
                                       
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-outline-dark" onClick={()=>trashActionPopup(element)} title="Trash Options" ><FaRegTrashCan /></button>
                                            <button className="btn btn-outline-dark"  ><FaEdit /></button>
                                            <button className="btn btn-outline-dark" ><IoMdArchive /></button>
                                            <button className="btn btn-danger"> <IoMdDoneAll /> </button>
                                        </div>
                                        
                                    </div>
                                </div>
                                        </>
                                    )
                                })
                               }
                         
                        </div>
                  
                </div>
            </div>
        </div>
    );
}