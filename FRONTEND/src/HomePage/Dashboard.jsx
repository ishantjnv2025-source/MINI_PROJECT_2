import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import Sidebar from "./Sidebar.jsx";
import NoteCard from "./NoteCard.jsx";
import Navbar from "./Navbar.jsx";
import CreateNote from "./CreateNote.jsx";
import DetailCard from "./DetailCard.jsx";
import Account from "./Account.jsx";
import axios from "axios";
const Dashboard = () => {
  const [favNote, setFavNote] = useState([]);
  const [note, setNote] = useState([]);
  const [view, setView] = useState("all");
  const [selectedNote, setSelectedNote] = useState(null);
  const [account, setAccount] = useState(false);
  const [user, setUser] = useState("");
  const [searchNote, setSearchNote] = useState([]);
  const clickUser = () => {
    setAccount(true);
  };

  const searchFiles = async (query) => {
    try {
      console.log( `${import.meta.env.VITE_BACKEND_URL}/api/v1/file/search?title=${query}`)
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/file/search?title=${query}`,
      {
          withCredentials: true,
        });

      if (res.data.success) {
        setSearchNote(res.data.data);
        setView("search"); // ✅ switch to search view
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleToggleFavourite = (note) => {
    setFavNote((prev) => {
      const exists = prev.some((f) => f._id === note._id);

      if (exists) {
        return prev.filter((f) => f._id !== note._id); // remove
      } else {
        return [...prev, note]; // add full note
      }
    });
  };
  const handleCardClick = (note) => {
    setSelectedNote(note); // open modal
  };

  const closeModal = () => {
    setSelectedNote(null); // close modal
  };
  const closeUser = () => {
    setAccount(!account);
  };
  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/file`);
      if (res) {
        setNote(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/user`, {
        withCredentials: true,
      });
      if (res) {
        setUser(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setFav = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/file/getFavourite`,
        {
          withCredentials: true,
        },
      );
      if (res.data.success) {
        setFavNote(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // push current state
    window.history.pushState(null, "", window.location.href);

    const handleBack = () => {
      // stay on dashboard
      window.history.pushState(null, "", window.location.href);

      // reset UI state
      setView("all");
      setSelectedNote(null);
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  // fetchNotes()
  useEffect(() => {
    fetchNotes();
    fetchUser();
    setFav();
  }, [view]);

  return (
    <div className="containers">
      {/* SIDEBAR */}
      <Sidebar
        setView={setView}
        fetchNotes={fetchNotes}
        clickUser={clickUser}
        user={user}
        setFavNote={setFavNote}
      />

      {/* MAIN */}
      <main className="main">
        {/* TOPBAR */}
        <Navbar setNotes={setNote} onSearch={searchFiles} />

        {/* CONTENT */}
        <div className="content">
          {view === "all" && (
            <>
              <h1>All Notes</h1>
              <p className="sub">{note.length} notes</p>

              <div className="grid">
                {note.map((item) => (
                  <NoteCard
                    key={item._id}
                    data={item}
                    onClick={() => handleCardClick(item)}
                  />
                ))}
              </div>
              {selectedNote && (
                <DetailCard
                  note={selectedNote}
                  onClose={closeModal}
                  favNote={favNote}
                  onToggleFavourite={handleToggleFavourite}
                />
              )}
              {account && <Account onClose={closeUser} user={user} />}
            </>
          )}
          {view === "favourite" && (
            <>
              <h1>Favourites</h1>
              <p className="sub">{favNote.length} notes</p>

              <div className="grid">
                {favNote.map((item) => (
                  <NoteCard
                    key={item._id}
                    data={item}
                    onClick={() => handleCardClick(item)}
                  />
                ))}
              </div>
              {selectedNote && (
                <DetailCard
                  note={selectedNote}
                  onClose={closeModal}
                  favNote={favNote}
                  onToggleFavourite={handleToggleFavourite}
                />
              )}
              {account && <Account onClose={closeUser} user={user} />}
            </>
          )}
          {view === "search" && (
            <>
              <h1>Search Results</h1> {/* ✅ fixed */}
              <p className="sub">{searchNote.length} notes</p>
              <div className="grid">
                {searchNote.map(
                  (
                    item, // ✅ FIXED
                  ) => (
                    <NoteCard
                      key={item._id}
                      data={item}
                      onClick={() => handleCardClick(item)}
                    />
                  ),
                )}
              </div>
              {selectedNote && (
                <DetailCard
                  note={selectedNote}
                  onClose={closeModal}
                  favNote={favNote}
                  onToggleFavourite={handleToggleFavourite}
                />
              )}
              {account && <Account onClose={closeUser} user={user} />}
            </>
          )}

          {view === "create" && <CreateNote setView={setView} />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
