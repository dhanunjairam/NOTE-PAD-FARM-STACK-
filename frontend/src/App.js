import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes ,Link} from 'react-router-dom';
import Notepage from './Notepage';
import UpdateNotePage from './components/Updatenote';
import Login from './components/Login';
import Register from './components/Register';
import EditNote from './components/Updatenote';
function App() {
  return (
    <Router>
      <div className='app-background'> 
      <div className="App-container">
      <div className="App list-group-item">
      <div className="App list-group-item justify-content-center align-items-center mx-auto">


      <h1 className="bold-notepad-title">NOTE PAD</h1>
          <h6 className="card-subtitle">FASTAPI - React - MongoDB</h6>

          <nav className="nav-buttons">
            <Link to="/login" className="btn btn-primary m-2">Login</Link>
            <Link to="/register" className="btn btn-secondary m-2">Register</Link>
            <Link to="/" className="btn btn-success m-2">Home</Link>
          </nav>

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/notepage" element={<Notepage />} />
            <Route path="/updatenote/:title" element={<EditNote />} />
            <Route path="/" element={<div style={{'textAlign':'center'}}>Home Page</div>} />
          </Routes>
      </div>
      </div>
      

      </div>
      <footer style={{'text-align':'center','color':'blue'}}><p>Copyright 2024, All rights reserved &copy;</p></footer>
      </div>
      
    </Router>
  );
}

export default App;
