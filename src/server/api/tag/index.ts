import { defineEventHandler, createError, getQuery } from "h3";
import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Extract pagination parameters from query (e.g., ?page=1&limit=10)
    const query = getQuery(event);
    const page = Math.max(1, parseInt(query.page as string) || 1);  // Default to page 1 if not provided
    const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 10)); // Default to 10 items per page, max 100

    // Calculate the offset for pagination
    const skip = (page - 1) * limit;

    // Fetch the paginated tags from the database
    const tags = await prisma.tag.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc', // Optional: You can order by any column you want.
      },
    });

    // Get the total count of tags for pagination info
    const totalTags = await prisma.tag.count();

    // Calculate total pages
    const totalPages = Math.ceil(totalTags / limit);

    return {
      success: true,
      data: tags,
      pagination: {
        totalTags,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    };
  } catch (error) {
    console.error("Error occurred:", error);
    return createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      
    });
  }
});
