
import NoteItem from './Note'

export default function NoteView(props) {
    return (
        <div>
            <ul>
                {props.noteList.map(note => <NoteItem note={note} />)}
            </ul>
        </div>
    )
}