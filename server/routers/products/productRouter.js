import { Router } from "express";
const router = Router();

const movies = [
  {
    id: 1,
    name: "The Shawshank Redemption",
    director: "Frank Darabont",
  },
  {
    id: 2,
    name: "The Godfather",
    director: "Francis Ford Coppola",
  },
];

router.get("/api/movies", (req, res) => {
  res.send(movies);
});

router.get("/api/:id", (req, res) => {
  // Add your code to fetch a specific product by ID
});

router.post("/api/", (req, res) => {
  // Add your code to create a new product
});

router.put("/api/:id", (req, res) => {
  // Add your code to update a specific product by ID
});

router.delete("/api/:id", (req, res) => {
  // Add your code to delete a specific product by ID
});

export default router;
