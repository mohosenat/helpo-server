import { Router } from "express";

import {
  createEventController,
  getEventByIdController,
  getUpcomingEventsController,
} from "../controllers/event.controller.js";

const router = Router();

router.get("/", getUpcomingEventsController);
router.post("/", createEventController);
router.get("/:id", getEventByIdController);

export default router;