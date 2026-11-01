import type { Request, Response } from "express";
import { getEventById, getUpcomingEvents } from "../services/event.service.js";
import { ObjectId } from "mongodb";

export const getUpcomingEventsController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const events = await getUpcomingEvents();

    res.status(200).json({
      success: true,
      message: "Upcoming events fetched successfully",
      data: events,
    });
  } catch (error) {
    console.error("Error fetching upcoming events:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch upcoming events",
    });
  }
};
export const getEventByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    // Validate event ID
    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
      return;
    }

    const event = await getEventById(id);

    // Check if event exists
    if (!event) {
      res.status(404).json({
        success: false,
        message: "Event not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Event fetched successfully",
      data: event,
    });
  } catch (error) {
    console.error("Error fetching event:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch event",
    });
  }
};