import './App.css';
import React from 'react';
import {Routes, Route} from "react-router-dom";
import {
  Home,
  AddMovieForm
} from "./pages";

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/AddMovie" element={<AddMovieForm/>}/>
      </Routes>
    </div>
  );
}

export default App;
