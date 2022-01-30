import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import {MongoClient} from 'mongodb';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const app = express();
app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

let movieData = undefined;
fs.readFile("./data/movies.json", "utf8", (err, data) => {
    console.log(err)
    console.log(data)
    movieData = data;
});


app.get('/hello', (req, res) => {res.send("Hello")});

app.get('/api/movies', async (req, res) => {

    try{
        const client = await MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true});
        const db = client.db('my-movies');

        const movieInfo = await db.collection('movies').find({}).toArray();
        res.status(200).json(movieInfo);
        client.close();
    }
    catch (error){
        res.status(500).json({message: "Error connecting to database", error});
    }
    
});

app.get('*', (req, res) => (res.sendFile(path.join(__dirname + '/build/index.html'))))

app.listen(8000, () => console.log("Listening on port 8000"));