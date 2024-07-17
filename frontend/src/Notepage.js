import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteView from './components/NoteListView';

function Notepage() {
  const [noteList, setNoteList] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [isNotesVisible, setIsNotesVisible] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/notes', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setNoteList(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, []);

  const addNoteHandler = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/notes', {
        title: title,
        description: desc
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTitle('');
      setDesc('');
      const response = await axios.get('http://localhost:8000/notes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNoteList(response.data);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleEditNote = async () => {
    if (editingNote && editingNote.title) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:8000/notes/${editingNote.title}`, {
          title: title,
          description: desc
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTitle('');
        setDesc('');
        setEditingNote(null);
        const response = await axios.get('http://localhost:8000/notes', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setNoteList(response.data);
      } catch (error) {
        console.error('Error updating note:', error);
      }
    } else {
      console.error('No note selected for editing');
    }
  };

  

  const startEditing = (note) => {
    setTitle(note.title);
    setDesc(note.description);
    setEditingNote(note);
  };

  return (
    <div cclassName="notepage-container">
      <div className="note-form">
      <h5 className="card text-white bg-dark mb-3">{editingNote ? 'Edit Your Note' : 'Add Your Note'}</h5>
      <span className="card-text">
        <input
          className="mb-2 desIn"
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder='Title'
          disabled={editingNote !== null} // Disable title input when editing
        />
        <textarea
          className="mb-2 form-control desIn"
          value={desc}
          onChange={event => setDesc(event.target.value)}
          placeholder='Description'
        />
        <button
          className="btn btn-outline-primary mx-2 mb-3"
          style={{ 'borderRadius': '50px', "fontWeight": "bold" }}
          onClick={editingNote ? handleEditNote : addNoteHandler}
        >
          {editingNote ? 'Update Note' : 'Add Note'}
        </button>
      </span>
      <h5 className="card text-white bg-dark mb-3">Your Notes</h5>
      <div className="note-list">
      <h5 className="dropdown-header" onClick={() => setIsNotesVisible(!isNotesVisible)}>
          Your Notes {isNotesVisible ? '▲' : '▼'}
        </h5>
        {isNotesVisible && <NoteView noteList={noteList} />}
      </div>
    </div>
    </div>
  );
}

export default Notepage;
