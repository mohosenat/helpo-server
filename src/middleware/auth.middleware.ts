import type { RequestHandler } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../config/auth.js";

export const authenticateUser: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first.",
      });
      return;
    }

    res.locals.user = session.user;
    res.locals.session = session.session;

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};