import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";

import {
  createEventController,
  getEventByIdController,
  getMyEventsController,
  getUpcomingEventsController,
  updateEventController,
} from "../controllers/event.controller.js";

const router = Router();

router.get("/", getUpcomingEventsController);
router.post("/", authenticateUser, createEventController);
router.get("/my-events", authenticateUser, getMyEventsController);
router.get("/:id", getEventByIdController);
router.put("/:id", authenticateUser, updateEventController);

export default router;