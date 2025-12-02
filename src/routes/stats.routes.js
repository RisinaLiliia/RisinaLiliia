import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getStats } from "../controllers/stats.controller.js";

const router = express.Router();
router.get("/", asyncHandler(getStats));
export default router;
