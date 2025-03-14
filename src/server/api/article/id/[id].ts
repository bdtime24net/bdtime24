import { defineEventHandler, createError } from "h3";
import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Extract ID from the URL parameters
    const id = event.context.params?.id;
    if (!id) {
      throw createError({ statusCode: 400, message: "Article ID is required" });
    }

    // Fetch the article by ID
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        category: true, // Include category details
        Tag: true, // Include tag details
        User: {
          select: { id: true, username: true }, // Fetch user details but avoid exposing sensitive data
        },
        Comment: true, // Include comments
      },
    });

    if (!article) {
      throw createError({ statusCode: 404, message: "Article not found" });
    }

    return { success: true, article };
  } catch (error) {
    console.error("Error fetching article:", error);

    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
  }
});