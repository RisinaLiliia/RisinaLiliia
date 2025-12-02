import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getTopLangs } from "../controllers/langs.controller.js";

const router = express.Router();
router.get("/", asyncHandler(getTopLangs));
export default router;
