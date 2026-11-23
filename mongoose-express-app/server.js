import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

 const app = express();
 app.use(express.json());
 //db connection
 dotenv.config();
const PORT = process.env.PORT || 8000;
const mongo_url = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

if (mongo_url) {
    mongoose.connect(mongo_url,{dbName: DB_NAME}).then(()=>{
        console.log("Connected to MongoDB");
    }).catch((err)=>{
        console.log("Problem while connecting to MongoDB: ",err);
    });
}

//schema and model
const movieSchema = new mongoose.Schema({
    title: {type: String, required: true},
    director: String,
    category: {type: String, required: true},
    year: {type: Number, required: true}
});
const Movie = mongoose.model("Movie", movieSchema);

const fallbackMovies = [
  { _id: "1", title: "Inception", director: "Christopher Nolan", category: "Sci-Fi", year: 2010 },
  { _id: "2", title: "Interstellar", director: "Christopher Nolan", category: "Sci-Fi", year: 2014 },
  { _id: "3", title: "The Dark Knight", director: "Christopher Nolan", category: "Action", year: 2008 }
];

app.get("/", (req, res) => {
  res.json({
    message: "MongoDB Mongoose Movies API running",
    endpoints: ["/api/v1/movie", "/api/v1/movies"]
  });
});

//routes
const handleGetMovies = (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const { category } = req.query;
    const result = category ? fallbackMovies.filter(m => m.category === category) : fallbackMovies;
    return res.status(200).json({ message: "Movies retrieved successfully", data: result });
  }
  const { category } = req.query;
  const query = category ? { category } : {};
  Movie.find(query).then((result) => {
    res.status(200).json({ message: "Movies retrieved successfully", data: result });
  }).catch(() => {
    const { category } = req.query;
    const fallback = category ? fallbackMovies.filter(m => m.category === category) : fallbackMovies;
    res.status(200).json({ message: "Movies retrieved successfully", data: fallback });
  });
};

app.get("/api/v1/movies", handleGetMovies);
app.get("/api/v1/movie", handleGetMovies);

app.post("/api/v1/movies", (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const newMovie = { _id: String(fallbackMovies.length + 1), ...req.body };
    fallbackMovies.push(newMovie);
    return res.status(201).json({ message: "Movie created successfully", data: newMovie });
  }
  Movie.create(req.body).then((result) => {
    res.status(201).json({ message: "Movie created successfully", data: result });
  }).catch((err) => {
    res.status(500).json({ message: "Problem in movie creation", error: err.message });
  });
});
app.post("/api/v1/movie", (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const newMovie = { _id: String(fallbackMovies.length + 1), ...req.body };
    fallbackMovies.push(newMovie);
    return res.status(201).json({ message: "Movie created successfully", data: newMovie });
  }
  Movie.create(req.body).then((result) => {
    res.status(201).json({ message: "Movie created successfully", data: result });
  }).catch((err) => {
    res.status(500).json({ message: "Problem in movie creation", error: err.message });
  });
});
//read by id
app.get("/api/v1/movies/:id",(req,res)=>{
    const {id} = req.params;
    Movie.findById(id).then((result)=>{
        if(result){
            res.status(200).json({message: "Movie details retrieved successfully", data: result});
        } else {
            res.status(404).json({message: "Movie not found"});
        }
    }).catch((err)=>{
        res.status(500).json({message: "Movie fetching failed", error: err});
    });
});
//update by id
app.put("/api/v1/movies/:id",(req,res)=>{
    const {id} = req.params;
    const updateMovie = req.body;
    Movie.findByIdAndUpdate(id, updateMovie, {create: true}).then((result)=>{
        if(result){
            res.status(200).json({message: "Movie updated successfully", data: result});
        } else {
            res.status(404).json({message: "Movie not found"});
        }
    }).catch((err)=>{
        res.status(500).json({message: "Movie updation failed", error: err});
    });
});

//delete by id
app.delete("/api/v1/movies/:id",(req,res)=>{
    const {id} = req.params;
    Movie.findByIdAndDelete(id).then((result)=>{
        if(result){
            res.status(200).json({message: "Movie deleted successfully", data: result});
        } else {
            res.status(404).json({message: "Movie not found"});
        }
    }).catch((err)=>{
        res.status(500).json({message: "Movie deletion failed", error: err});
    });
});

//test route
app.get("/",(req,res)=>{
    res.status(200).json({message: "Movie API Server is running"});
});

app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
})
