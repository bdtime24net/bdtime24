import { defineEventHandler, readBody, createError, getHeader } from "h3";
import prisma from "~/server/utils/prisma";
import { divisionSchema } from "../validation";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = divisionSchema.safeParse(body);
    if (!validatedData.success) {
      throw createError({ statusCode: 400, message: "Invalid input" });
    }

    // Check if division already exists by name or URL
    const existingDivision = await prisma.division.findFirst({
      where: {
        OR: [
          { name: validatedData.data.name },
          { url: validatedData.data.url },
        ],
      },
    });
    if (existingDivision) {
      throw createError({
        statusCode: 400,
        statusMessage: "Division with this name or URL already exists",
      });
    }

    // Create a new division
    const division = await prisma.division.create({
      data: {
        ...validatedData.data,
      },
    });

    return { success: true, message: 'Division created successfully', data: division };
  } catch (error) {
    console.error("Error occurred:", error);
    return createError({
      statusCode: 500,

      statusMessage: "Internal Server Error",
    });
  }
});
