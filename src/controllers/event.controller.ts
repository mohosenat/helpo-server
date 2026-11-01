import type { Request, Response } from "express";
import { createEvent, getEventById, getUpcomingEvents } from "../services/event.service.js";
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

export const createEventController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      eventType,
      image,
      location,
      eventDate,
      creatorEmail,
    } = req.body;

    if (
      !title ||
      !description ||
      !eventType ||
      !image ||
      !location ||
      !eventDate ||
      !creatorEmail
    ) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }

    const parsedDate = new Date(eventDate);

    if (Number.isNaN(parsedDate.getTime()) || parsedDate <= new Date()) {
      res.status(400).json({
        success: false,
        message: "Event date must be in the future",
      });
      return;
    }

    const event = await createEvent({
      title,
      description,
      eventType,
      image,
      location,
      eventDate: parsedDate,
      creatorEmail,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error("Error creating event:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create event",
    });
  }
};