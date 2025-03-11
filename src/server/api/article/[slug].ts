import { defineEventHandler, createError } from "h3";
import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Extract slug from the URL parameters
    const slug = getRouterParam(event, 'slug');
    if (!slug) {
      throw createError({
        statusCode: 400,
        message: "Slug is required",
      });
    }
    console.log(slug)

    // Fetch the article by slug, including related data
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        category: true, // Include category details
        Tag: true, // Include tag details
        User: {
          select: { id: true, username: true }, // Select only non-sensitive user data
        },
        Comment: true, // Include comments
      },
    });

    if (!article) {
      throw createError({
        statusCode: 404,
        message: "Article not found",
      });
    }

    // Return success with the article data
    return {
      success: true,
      message: "Article fetched successfully",
      data: article,
    };
  } catch (error) {
    console.error("Error fetching article:", error);

    // If the error is an instance of Error, return the message in a structured way
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }

    // Generic error handling
    return {
      success: false,
      message: "An unexpected error occurred",
      data: null,
    };
  }
});
