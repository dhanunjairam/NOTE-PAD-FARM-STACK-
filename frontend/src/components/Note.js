
import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
function NoteItem(props) {
  const navigate = useNavigate();
    const deleteNoteHandler = (title) => {
    axios.delete(`http://localhost:8000/api/notes/${title}`).then(res => console.log(res.data)) 
           
  }
  const editNoteHandler = () => {
    navigate(`/updatenote/${props.note.title}`, { state: { note: props.note } });
};


  return (
        <div>
            <p>
                <span style={{ fontWeight: 'bold, underline' }}>{props.note.title} : </span> {props.note.description} 
                <button onClick={() => deleteNoteHandler(props.note.title)} className="btn btn-outline-danger my-2 mx-2" style={{'borderRadius':'50px',}}>DELETE</button>
                <button  onClick={editNoteHandler} className="btn btn-outline-danger my-2 mx-2" style={{'borderRadius':'50px',}}>Edit</button>
                <hr></hr>
            </p>
        </div>
  )
}

export default NoteItem;