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