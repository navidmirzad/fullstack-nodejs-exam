import { Router } from "express";
import { getJerseys, getJersey } from "../../database/productQueries.js";
const router = Router();

router.get("/api/jerseys", async (req, res) => {
  try {
    const jerseys = await getJerseys();
    res.json(jerseys);
  } catch (error) {
    console.error("Error fetching jerseys:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/api/jerseys/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const jersey = await getJersey(id);
    if (jersey) {
      res.json(jersey);
    } else {
      res.status(404).json({ error: "Jersey not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch jersey" });
  }
});


export default router;
