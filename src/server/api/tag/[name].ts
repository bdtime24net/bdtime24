import { defineEventHandler, createError } from "h3";
import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Extract slug from the URL parameters
    const name = event.context.params?.name;
    if (!name) {
      throw createError({ statusCode: 400, message: "Slug is required" });
    }

    // Fetch the article by slug
    const article = await prisma.tag.findUnique({
      where: {
        name
      }
      
    });

    if (!article) {
      throw createError({ statusCode: 404, message: "Tag not found" });
    }

    return { success: true, article };
  } catch (error) {
    console.error("Error fetching article:", error);

    if (error instanceof Error) {
        return { success: false, error: error.message };
      }
  }
});
