import {React, useRef} from "react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import Container from "react-bootstrap/Container"
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'



export function Home(){

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch('/api/movies')
      .then((response) => response.json())
      .then(setMovies)
  }, []);

  const removeMovie = async (props) => {
    let info = {
      "_id" : props._id,
      "name": props.name,
      "date": props.date,
      "actors": props.actors,
      "poster": props.poster,
      "rating": props.rating
    };
    

    await fetch('/api/removeMovie', {
      method: 'POST',
      body: JSON.stringify(info),
      headers: {'Content-Type': 'application/json'}
    })

    fetch('/api/movies')
      .then((response) => response.json())
      .then(setMovies);
  };
 

  function Movie(props) {
    console.log(props);
    return (
      <>
        <Container className="mt-3 square border border-dark border-3">
          <Row>
            <Col md="4" className="justify-content-left my-3">
              <Image src={"./images/"+props.info.poster} alt={props.info.name} width="200px"></Image>
            </Col>
            <Col md="8" className="my-auto">
              <h2>{props.info.name}</h2>
              <p>{props.info.date}</p>
              <p>{(props.info.actors).join(" - ")}</p>
              <p>{props.info.rating} out of 5 stars</p>
              <Button onClick={()=> removeMovie(props.info)} >Remove</Button>
            </Col>
          </Row>
        </Container>
      </>
    )
  }

  return (
    <div className="App">
      <Header></Header>
      <Container className="my-3 mx-auto">
        { movies.map( (movie) => { return <Movie key={movie.name} info={movie}></Movie>}) }
      </Container>
    </div>
  );
}

function Header(){
  return(
    <>
      <header>
        <Navbar bg="dark" variant="dark" sticky="top">
          <Container>
            <Navbar.Brand href="/">Movie Library</Navbar.Brand>
            <Nav placement="end">
              <Nav.Link href="/AddMovie">Add Movie</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      </header>
    </>
  )
}


export function AddMovieForm() {

  const addMovieDatabase = async (name, date, actors, poster, rating) => {
    let info = {
      "name": name,
      "date": date,
      "actors": actors,
      "poster": poster.name,
      "rating": rating
    };

    await fetch('/api/addMovie', {
      method: 'POST',
      body: JSON.stringify(info),
      headers: {'Content-Type': 'application/json'}
    })

    const formData = new FormData();

    formData.append('poster', poster);

    await fetch('/api/upload_files', {
      method: "POST",
      body: formData
    })
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
    const poster = formPoster.current.files[0];
    const rating = formRating.current.value;
    
    addMovieDatabase(name, date, actors.split(", "), poster, rating);
    formName.current.value = "";
    formDate.current.value = "";
    formActors.current.value = "";
    formPoster.current.value = "";
    formRating.current.value = "";
  };
    
  return (
    <>
      <Header></Header>
      <Form method="POST" onSubmit={submit} encType="multipart/form-data" className="mt-3 mx-5">
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Poster</Form.Label>
            <Form.Control ref={formPoster} type="file" required />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Movie</Form.Label>
            <Form.Control ref={formName} type="text" required  />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Release Date</Form.Label>
            <Form.Control ref={formDate} type="text" required  />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Cast</Form.Label>
            <Form.Control ref={formActors} type="text" required />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>Rating</Form.Label>
            <Form.Select ref={formRating} required>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Form.Select>
          </Form.Group>
        </Row>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
}