import { defineEventHandler, createError, getQuery } from "h3";
import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Extract pagination parameters
    const query = getQuery(event);
    const page = Math.max(1, parseInt(query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.pageSize as string) || 10));
    const skip = (page - 1) * limit;

    // Fetch paginated categories
    const categories = await prisma.newsCategory.findMany({
      skip,
      take: limit,
      orderBy: { publishedAt: 'desc' },
    });

    // Get the total count of categories
    const totalCategories = await prisma.newsCategory.count();

    // Calculate total pages
    const totalPages = Math.ceil(totalCategories / limit);

    return {
      success: true,
      data: categories,
      pagination: {
        totalCategories,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return createError({ statusCode: 500, statusMessage: "Internal Server Error" });
  }
});
