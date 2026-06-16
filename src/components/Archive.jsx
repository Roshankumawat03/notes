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

export default function Archive() {
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

    
    const archiveActionPopup = async (note) => {
        const result = await Swal.fire({
            title: "Archive Options",
            text: "What do you want to do with this note?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Restore",
            cancelButtonText: "Cancel",
        });

        const db = await openDB("notesDb", 1);
        const tx = db.transaction("notes", "readwrite");
        const store = tx.objectStore("notes");

        if (result.isConfirmed) {
            const noteData = await store.get(note.id);

            noteData.isArchive = false;   
            noteData.isDeleted = false;


            await store.put(noteData);

            setBinNotes((prev) => prev.filter((n) => n.id !== note.id));
            Swal.fire("Restored!", "Note moved to All Notes", "success");
        }
        };


      useEffect(() => {
        dbPromise.then((db) =>
          db.getAll("notes").then((data) => {
            const archiveNotes = data.filter((note)=> note.isArchive === true && note.isDeleted !== true);
            setBinNotes(archiveNotes);
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
                                            <button className="btn btn-outline-dark"  ><FaRegTrashCan /></button>
                                            <button className="btn btn-outline-dark"  ><FaEdit /></button>
                                            <button className="btn btn-outline-dark" onClick={()=> archiveActionPopup(element)}><IoMdArchive /></button>
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