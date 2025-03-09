import { defineEventHandler, readBody, createError } from "h3";
import prisma from "~/server/utils/prisma";
import { districtSchema } from "../validation";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = districtSchema.safeParse(body);
    if (!validatedData.success) {
      throw createError({ statusCode: 400, message: "Invalid input" });
    }

    // Check if district already exists by name or URL
    const existingDistrict = await prisma.district.findFirst({
      where: {
        OR: [
          { name: validatedData.data.name },
          { url: validatedData.data.url },
        ],
      },
    });
    if (existingDistrict) {
      throw createError({
        statusCode: 400,
        statusMessage: "District with this name or URL already exists",
      });
    }

    // Create a new division
    const district = await prisma.district.create({
      data: {
        ...validatedData.data,
      },
    });

    return { success: true, message: 'District created successfully', data: district };
  } catch (error) {
    console.error("Error occurred:", error);
    return createError({
      statusCode: 500,

      statusMessage: "Internal Server Error",
    });
  }
});
