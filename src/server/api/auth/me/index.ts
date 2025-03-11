import prisma from "~/server/utils/prisma";
import jwt from "jsonwebtoken";
import { defineEventHandler, getHeader, createError } from "h3";

// Define the expected structure of the decoded JWT token
interface DecodedToken {
  userId: string;
}

export default defineEventHandler(async (event) => {
  try {
    // Get token from headers
    const token = getHeader(event, "authorization")?.split(" ")[1];
    
    if (!token) {
      throw createError({ statusCode: 401, message: "Unauthorized: Token missing" });
    }

    // Verify JWT
    const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
    
    if (SECRET_KEY === "your_secret_key") {
      console.warn("WARNING: Using the default secret key. Make sure to set JWT_SECRET in your environment variables.");
    }

    let decoded: DecodedToken;

    try {
      decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;
    } catch (jwtError) {
      throw createError({ statusCode: 401, message: "Invalid token: Unable to verify" });
    }

    // Fetch user from the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, email: true, createdAt: true },
    });

    if (!user) {
      throw createError({ statusCode: 404, message: "User not found" });
    }

    // Return the user object
    return { user };
    
  } catch (error) {
    // Type guard for known error types
    const statusCode = (error as any).statusCode || 500; // Default to 500 if statusCode is not present
    const message = (error as any).message || "Error fetching user data";

    // Return a structured error response
    return createError({ statusCode, message });
  }
});
