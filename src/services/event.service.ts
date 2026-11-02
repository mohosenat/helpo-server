import connectDB from "../config/db.js";
import { ObjectId } from "mongodb";

export const getUpcomingEvents = async () => {
  const db = await connectDB();

  const events = await db
    .collection("events")
    .find({
      eventDate: { $gt: new Date() },
    })
    .sort({ eventDate: 1 })
    .toArray();

  return events;
};

export const getEventById = async (id: string) => {
  const db = await connectDB();

  const event = await db.collection("events").findOne({
    _id: new ObjectId(id),
  });

  return event;
};

export const createEvent = async (eventData: {
  title: string;
  description: string;
  eventType: string;
  image: string;
  location: string;
  eventDate: Date;
  creatorEmail: string;
}) => {
  const db = await connectDB();

  const now = new Date();

  const newEvent = {
    ...eventData,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection("events").insertOne(newEvent);

  return {
    ...newEvent,
    _id: result.insertedId,
  };
};

export const getMyEvents = async (creatorEmail: string) => {
  const db = await connectDB();

  const events = await db
    .collection("events")
    .find({ creatorEmail })
    .sort({ createdAt: -1 })
    .toArray();

  return events;
};

export const updateEvent = async (
  id: string,
  creatorEmail: string,
  eventData: {
    title: string;
    description: string;
    eventType: string;
    image: string;
    location: string;
    eventDate: Date;
  }
) => {
  const db = await connectDB();

  const result = await db.collection("events").findOneAndUpdate(
    {
      _id: new ObjectId(id),
      creatorEmail,
    },
    {
      $set: {
        ...eventData,
        updatedAt: new Date(),
      },
    },
    {
      returnDocument: "after",
    }
  );

  return result;
};

export const deleteEvent = async (
  id: string,
  creatorEmail: string
) => {
  const db = await connectDB();

  const result = await db.collection("events").deleteOne({
    _id: new ObjectId(id),
    creatorEmail,
  });

  return result;
};


export const joinEvent = async (
  eventId: string,
  userEmail: string
) => {
  const db = await connectDB();

  const eventObjectId = new ObjectId(eventId);

  // Check if the event exists
  const event = await db.collection("events").findOne({
    _id: eventObjectId,
  });

  if (!event) {
    return {
      success: false,
      message: "Event not found",
    };
  }

  // Check if the user already joined
  const existingJoin = await db.collection("eventParticipants").findOne({
    eventId: eventObjectId,
    userEmail,
  });

  if (existingJoin) {
    return {
      success: false,
      message: "You have already joined this event",
    };
  }

  // Save the participant
  await db.collection("eventParticipants").insertOne({
    eventId: eventObjectId,
    userEmail,
    joinedAt: new Date(),
  });

  return {
    success: true,
    message: "You have successfully joined the event",
  };
};
