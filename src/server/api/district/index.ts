import { defineEventHandler, getQuery, createError } from "h3";
import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);

    // Pagination
    const page = parseInt(query.page as string) || 1;
    const pageSize = parseInt(query.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;

    // Filters
    const search = query.search ? (query.search as string) : "";
    const categoryId = query.categoryId ? (query.categoryId as string) : null;
    const tagId = query.tagId ? (query.tagId as string) : null;

    // Prisma query filters
    const where: any = {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        categoryId ? { categoryId } : {},
        tagId ? { tagId } : {},
      ],
    };

    // Fetch total count for pagination
    const totalCount = await prisma.district.count({ where });

    // Fetch articles with filters, pagination, and related data
    const articles = await prisma.district.findMany({
      where,
      skip,
      take: pageSize
    });

    return {
      success: true,
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      articles,
    };
  } catch (error) {
    console.error("Error fetching articles:", error);

    if (error instanceof Error) {
        return { success: false, error: error.message };
      }
  }
});
