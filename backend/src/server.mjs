import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';


let movieData = undefined;
fs.readFile("./data/movies.json", "utf8", (err, data) => {
    console.log(err)
    console.log(data)
});


const app = express();
app.use(bodyParser.json());

app.get('/hello', (req, res) => {res.send("Hello")});

app.get('/api/movies', (req, res) => {
    res.send("under construction")
});

app.listen(8000, () => console.log("Listening on port 8000"));