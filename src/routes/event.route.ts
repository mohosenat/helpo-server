import { Router } from "express";

import {
  createEventController,
  getEventByIdController,
  getMyEventsController,
  getUpcomingEventsController,
  updateEventController,
} from "../controllers/event.controller.js";

const router = Router();

router.get("/", getUpcomingEventsController);
router.post("/", createEventController);
router.get("/my-events", getMyEventsController);
router.get("/:id", getEventByIdController);
router.put("/:id", updateEventController);

export default router;