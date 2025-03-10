import prisma from "~/server/utils/prisma";
import { defineEventHandler, readBody, createError } from "h3";
import jwt from "jsonwebtoken";
import { createPostSchema } from "../validation";

const SECRET_KEY = process.env.JWT_SECRET;

export default defineEventHandler(async (event) => {
  try {
    const token = event.req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.error("No token found in request headers");
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }
  
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY as string);
      console.log("Decoded JWT:", decoded);  // Log decoded JWT to verify userId
    } catch (err) {
      console.error("JWT verification failed:", err);
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }
  
    const userId = (decoded as any).userId;  // Extract userId from decoded JWT
    console.log("Extracted userId:", userId);  // Log the extracted userId
  
    const body = await readBody(event);
    console.log("Request Body:", body);  // Log request body
  
    const validatedData = createPostSchema.safeParse(body);
    if (!validatedData.success) {
      console.log("Validation Errors:", validatedData.error);  // Log validation errors
      throw createError({ statusCode: 400, message: "Invalid input" });
    }
  
    const existingPost = await prisma.article.findUnique({
      where: { slug: validatedData.data.slug }
    });
  
    if (existingPost) {
      throw createError({ statusCode: 400, message: "Post with this slug already exists" });
    }
  
    const post = await prisma.article.create({
      data: {
        ...validatedData.data,
        userId: userId  // Use the userId from the decoded JWT
      }
    });

    console.log(post)
  
    return { success: true, post };
  } catch (error) {
    console.error("Unexpected error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
  }
  
});
