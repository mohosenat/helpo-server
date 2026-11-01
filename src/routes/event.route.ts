import { Router } from "express";

import {
  getEventByIdController,
  getUpcomingEventsController,
} from "../controllers/event.controller.js";

const router = Router();

router.get("/", getUpcomingEventsController);
router.get("/:id", getEventByIdController);

export default router;