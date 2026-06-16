import Header from "./Header";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";
import { IoMdArchive } from "react-icons/io";
import { FaRegTrashCan } from "react-icons/fa6";
// import "./allnotes.css"; // Optional CSS file
import { MdOutlinePushPin } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { MdIncompleteCircle } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import { useEffect, useState } from "react";
import { openDB } from "idb";
export default function AllNotes() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [allnotes, setAllnotes] = useState([])
    const [searchText, setSearchText] = useState("")
    const [finalSearch, setFinalSearch] = useState("");
    
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

      const deleteHandle = async(id)=>{
        const db = await openDB("notesDb", 1);
        const tx = db.transaction("notes","readwrite");
        const store = tx.objectStore("notes")
        const note = await store.get(id)
        note.isDeleted = true;
        note.isArchive = false;
        await store.put(note)
        setAllnotes((pre)=>pre.filter((n)=>n.id!=id))
      }

              //    edit notes
      const editNotes=async(note)=>{

        const { value: formValues } = await Swal.fire({
        title: "Edit Notes",
        html: `
          <input id="swal-title" class="swal2-input" placeholder="Title" />
          <textarea id="swal-desc" class="swal2-textarea" placeholder="notes"></textarea>
        `,
        confirmButtonText: "Update",
        showCancelButton: true,
        allowOutsideClick: false,
        focusConfirm: false,

        didOpen: () => {
          document.getElementById("swal-title").value = note?.title || "";
          document.getElementById("swal-desc").value = note?.note || "";
        },

        preConfirm: () => {
          const title = document.getElementById("swal-title").value.trim();
          const notes = document.getElementById("swal-desc").value.trim();

          if (!title || !notes) {
            Swal.showValidationMessage("Title and notes are required");
            return false;
          }

          return { title, note: notes };
        }
      });

        try {
        const db = await openDB("notesDb", 1);
        const tx = db.transaction("notes", "readwrite");
        const store = tx.objectStore("notes");

        const updateNotes = {
          ...note,
          title: formValues.title,
          note: formValues.note,
        };

        await store.put(updateNotes);
        await tx.done; 

        setAllnotes((prev) =>
          prev.map((n) => (n.id === note.id ? updateNotes : n))
        );

        Swal.fire("Updated!", "Your Note has been updated", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to update note", error);
      }

      }

      const archiveHandle = async(id)=>{
        const db = await openDB("notesDb", 1);
        const tx = db.transaction("notes","readwrite");
        const store = tx.objectStore("notes")
        const note = await store.get(id)
        note.isArchive = true;
        note.isDeleted = false
        await store.put(note)
        setAllnotes((pre)=>pre.filter((n)=>n.id!=id))
      }

      const pinHandle = async (id) => {
      const db = await openDB("notesDb", 1);
      const tx = db.transaction("notes", "readwrite");
      const store = tx.objectStore("notes");

      const note = await store.get(id);

      note.isPinned = !note.isPinned; 
      note.isArchive = false;
      note.isDeleted = false;

      await store.put(note);
      await tx.done;

      setAllnotes((prev) => prev.filter((n) => n.id !== id));
    };


      const filterNotes=allnotes.filter((ele)=>{
        if(!finalSearch.trim()) return true;
         const search = finalSearch.toLowerCase();

        return( ele?.title?.toLowerCase().includes(search) || ele?.note?.toLowerCase().includes(search)
        );
      });
    
    useEffect(() => {
      dbPromise.then((db) =>
        db.getAll("notes").then((data) => {
          const filtered = data.filter(
            (note) => note.isDeleted !== true && note.isArchive !== true &&  note.isPinned !== true
          );
          setAllnotes(filtered);
        })
      );
    }, []);
 
      

    return (
        <div className="dashboard-container">
            <Header onToggle={handleToggle} searchText={searchText} onSearch={setSearchText} onSearchClick={()=>setFinalSearch(searchText.trim())} />

            <div className="dashboard-wrapper">
                <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} />
                <div className="container py-4">
                 
                        <div className="row">
                           
                               {
                                filterNotes.map((element)=>{
                                    return(
                                        <>
                                         <div className="col-md-4 mb-3">
                                    <div className="card shadow-sm p-3">
                                        <div><i className="badge text-bg-danger rounded-5 text-danger"></i></div>
                                        <h5 className="card-title">{element.title}</h5>
                                        <p className="card-text">{element.note}</p>
                                        <p className="card-text">{element.time}</p>
                                       
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-outline-dark"  onClick={()=>deleteHandle(element.id)}><FaRegTrashCan /></button>
                                            <button className="btn btn-outline-dark" onClick={() => editNotes(element)} ><FaEdit /></button>
                                            <button className="btn btn-outline-dark" onClick={()=>archiveHandle(element.id)}><IoMdArchive /></button>
                                            <button className="btn btn-outline-dark"  onClick={() => pinHandle(element.id)}><MdOutlinePushPin /></button>
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