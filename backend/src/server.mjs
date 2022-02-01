import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import {MongoClient} from 'mongodb';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const storage = multer.diskStorage({
    destination: './src/build/images',
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
  
const upload = multer({ storage: storage })

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

app.post('/api/removeMovie', async (req, res) => {
    try {
        console.log(req.body.name);

        const client = await MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true});
        const db = client.db('my-movies');

        let returnVal = await db.collection('movies').deleteOne( {name:req.body.name})
        console.log(returnVal);
        
        if( returnVal.deletedCount == 1) {
            res.status(200).json({message: `Movie ${req.body.name} deleted`});
        }
        else {
            res.status(200).json({message: "Unable to delete movie"});
        }
        client.close();
    }
    catch( error) {
        res.status(500).json( { message: "Error connecting to db", error});
    }
});

app.post('/api/addMovie', async (req, res) => {
    try {
        const client = await MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true});
        const db = client.db('my-movies');

        await db.collection('movies').insertOne( {name:req.body.name, date:req.body.date, actors:req.body.actors,poster:req.body.poster, rating:req.body.rating})

        res.status(200).json({message: "Success"});
        client.close();
    }
    catch( error) {
        res.status(500).json( { message: "Error connecting to db", error});
    }
});

app.post('/api/upload_files', upload.single('poster'), function (req, res, next) {
    req.file
    // req.body will hold the text fields, if there were any
  })

app.get('*', (req, res) => (res.sendFile(path.join(__dirname + '/build/index.html'))))

app.listen(8000, () => console.log("Listening on port 8000"));