import { defineEventHandler, readBody, createError } from "h3";
import prisma from "~/server/utils/prisma";
import { unionSchema } from "../validation";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = unionSchema.safeParse(body);

    if (!validatedData.success) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: "Validation Error", 
        data: validatedData.error.flatten() 
      });
    }

    // Check if the Upazila exists
    const upazilaExists = await prisma.upazila.findUnique({
      where: { id: validatedData.data.upazilaId },
    });

    if (!upazilaExists) {
      throw createError({ statusCode: 404, statusMessage: "Upazila not found" });
    }

    // Check if the Union already exists in the same Upazila
    const existingUnion = await prisma.union.findFirst({
      where: { 
        name: validatedData.data.name,
        upazilaId: validatedData.data.upazilaId, // Ensure uniqueness within the Upazila
      },
    });

    if (existingUnion) {
      throw createError({ statusCode: 400, statusMessage: "Union with this name already exists in the Upazila" });
    }

    // Create the Union
    const union = await prisma.union.create({
      data: validatedData.data,
    });

    return {
      success: true,
      message: "Union created successfully",
      data: union,
    };

  } catch (error) {
    console.error("Error occurred:", error);

    if (error instanceof z.ZodError) {
      return createError({
        statusCode: 400,
        statusMessage: "Validation Error",
        data: error.flatten(),
      });
    }

    return createError({
      statusCode:  500,
      statusMessage: "Internal Server Error",
    });
  }
});
