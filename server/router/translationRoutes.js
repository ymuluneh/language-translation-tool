import express from "express";
import { translateText } from "../controllers/translationController.js";

const router = express.Router();

// POST /api/translate
router.post("/translate", translateText);

export default router;
