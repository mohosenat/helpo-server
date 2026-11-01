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