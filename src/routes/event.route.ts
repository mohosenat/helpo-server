import { Router } from "express";

import {
  createEventController,
  getEventByIdController,
  getMyEventsController,
  getUpcomingEventsController,
} from "../controllers/event.controller.js";

const router = Router();

router.get("/", getUpcomingEventsController);
router.post("/", createEventController);
router.get("/my-events", getMyEventsController);
router.get("/:id", getEventByIdController);

export default router;