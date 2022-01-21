import {React, useState, useRef} from "react";
import { NavLink } from "react-router-dom";



export function Home({movies, setMovies}){

  function removeMovie(id){
    const newList = movies.filter((movie)=>movie.name !== id)
    setMovies(newList);
  }


  function Movie(props) {
    console.log(props);
    return (
      <>
        <h2>{props.info.name}</h2>
        <img src={"./images/"+props.info.poster} alt={props.info.name} height="500px"/> 
        <p>{props.info.date}</p>
        <p>{(props.info.actors).join(" - ")}</p>
        <p>{props.info.rating} out of 5 stars</p>
        <button onClick={()=> removeMovie(props.info.name)} >Remove</button>
        
      </>
    )
  }

  return (
    <div className="App">
      <Header></Header>
      <h1>Movie Reviews</h1>
      { movies.map( (movie) => { return <Movie key={movie.name} info={movie}></Movie>}) }
    </div>
  );
}

function Header(){
  return(
    <>
      <header>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/AddMovie">Add Movie</NavLink>
        </nav>
      </header>
    </>
  )
}


export function AddMovieForm({movies, setMovies}) {

  function addMovie(name, date, actors, poster, rating){
    const newList = [...movies, {name, date, actors, poster, rating}];
    setMovies(newList);
  };

  const formName = useRef();
  const formDate = useRef();
  const formActors = useRef();
  const formPoster = useRef();
  const formRating = useRef();

  const submit = e => {
    e.preventDefault();
    const name = formName.current.value;
    const date = formDate.current.value;
    const actors = formActors.current.value;
    const poster = formPoster.current.value;
    const rating = formRating.current.value;
    addMovie(name, date, actors.split(", "), poster, rating);
    formName.current.value = "";
    formDate.current.value = "";
    formActors.current.value = "";
    formPoster.current.value = "";
    formRating.current.value = "";
  };
    
  return (
    <>
      <Header></Header>
      <form onSubmit={submit}>
        <div>
        <label>Poster: 
            <select ref={formPoster} required>
              <option value="backToTheFuture.jpg">Back to the Future</option>
              <option value="lotr.jpg">Lord of the Rings</option>
              <option value="whenHarryMetSally.jpg">When Harry Met Sally...</option>
              <option value="airplane.jpg">Airplane!</option>
            </select>
          </label>
          <br></br>
          <label>Movie: <input ref={formName} type="text" required /></label>
          <br></br>
          <label>Release Date: <input ref={formDate} type="text" required /></label>
          <br></br>
          <label>Cast: <input ref={formActors} type="text" required /></label>
          <br></br>
          <label>Rating: 
            <select ref={formRating} required>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </label>
          <br></br>
          <input type="submit" value="Submit"></input>
        </div>
      </form>
    </>
  );
}