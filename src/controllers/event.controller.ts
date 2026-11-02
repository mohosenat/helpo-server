import type { Request, Response } from "express";
import { createEvent, deleteEvent, getJoinedEvents, getEventById, getMyEvents, getUpcomingEvents, joinEvent, updateEvent } from "../services/event.service.js";
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
    } = req.body;

    if (
      !title?.trim() ||
      !description?.trim() ||
      !eventType?.trim() ||
      !image?.trim() ||
      !location?.trim() ||
      !eventDate
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

    const creatorEmail = res.locals.user.email;

    const event = await createEvent({
      title: title.trim(),
      description: description.trim(),
      eventType: eventType.trim(),
      image: image.trim(),
      location: location.trim(),
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


export const getMyEventsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const creatorEmail = res.locals.user.email;


    const events = await getMyEvents(creatorEmail);

    res.status(200).json({
      success: true,
      message: "Your events fetched successfully",
      data: events,
    });
  } catch (error) {
    console.error("Error fetching your events:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch your events",
    });
  }
};


export const updateEventController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
      return;
    }

    const {
      title,
      description,
      eventType,
      image,
      location,
      eventDate,
    } = req.body;

    if (
      !title?.trim() ||
      !description?.trim() ||
      !eventType?.trim() ||
      !image?.trim() ||
      !location?.trim() ||
      !eventDate
    ) {
      res.status(400).json({
        success: false,
        message: "All event fields are required",
      });
      return;
    }

    const parsedEventDate = new Date(eventDate);

    if (Number.isNaN(parsedEventDate.getTime())) {
      res.status(400).json({
        success: false,
        message: "Invalid event date",
      });
      return;
    }

    if (parsedEventDate <= new Date()) {
      res.status(400).json({
        success: false,
        message: "Event date must be in the future",
      });
      return;
    }

    const creatorEmail = res.locals.user.email;

    const updatedEvent = await updateEvent(id, creatorEmail, {
      title: title.trim(),
      description: description.trim(),
      eventType: eventType.trim(),
      image: image.trim(),
      location: location.trim(),
      eventDate: parsedEventDate,
    });

    if (!updatedEvent) {
      res.status(404).json({
        success: false,
        message: "Event not found or you are not authorized to update it",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update event",
    });
  }
};


export const deleteEventController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
      return;
    }

    const creatorEmail = res.locals.user.email;

    const result = await deleteEvent(id, creatorEmail);

    if (result.deletedCount === 0) {
      res.status(404).json({
        success: false,
        message: "Event not found or you are not authorized to delete it",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete event",
    });
  }
};


export const joinEventController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
      return;
    }

    const userEmail = res.locals.user.email;

    const result = await joinEvent(id, userEmail);

    if (!result.success) {
      const statusCode =
        result.message === "Event not found" ? 404 : 409;

      res.status(statusCode).json({
        success: false,
        message: result.message,
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Error joining event:", error);

    res.status(500).json({
      success: false,
      message: "Failed to join event",
    });
  }
};

export const getJoinedEventsController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const userEmail = res.locals.user.email;

    const events = await getJoinedEvents(userEmail);

    res.status(200).json({
      success: true,
      message: "Joined events retrieved successfully",
      data: events,
    });
  } catch (error) {
    console.error("Error retrieving joined events:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve joined events",
    });
  }
};


