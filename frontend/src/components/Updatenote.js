import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditNote() {
    const location = useLocation();
    const navigate = useNavigate();
    const { note } = location.state;
    const [title, setTitle] = useState(note.title);
    const [desc, setDesc] = useState(note.description);

    const updateNoteHandler = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8000/api/notes/${note.title}`, {
                title: title,
                description: desc
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/'); // Navigate back to the notes page after update
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    return (
        <div className="card-body">
            <h5 className="card text-white bg-dark mb-3">Edit Your Note</h5>
            <span className="card-text">
                <input
                    className="mb-2 form-control titleIn"
                    value={title}
                    onChange={event => setTitle(event.target.value)}
                    placeholder='Title'
                    disabled
                />
                <input
                    className="mb-2 form-control desIn"
                    value={desc}
                    onChange={event => setDesc(event.target.value)}
                    placeholder='Description'
                />
                <button
                    className="btn btn-outline-primary mx-2 mb-3"
                    style={{ borderRadius: '50px', fontWeight: 'bold' }}
                    onClick={updateNoteHandler}
                >
                    Update Note
                </button>
            </span>
        </div>
    );
}

export default EditNote;
