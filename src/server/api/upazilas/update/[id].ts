import { defineEventHandler, readBody, createError } from "h3";
import { upazilaUpdateSchema } from "../validation";
import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Extract ID from the request URL
    const id = event.context.params?.id;
    if (!id) {
      throw createError({ statusCode: 400, message: "upazilas ID is required" });
    }

    // Read request body
    const body = await readBody(event);
    const validatedData = upazilaUpdateSchema.safeParse(body);

    if (!validatedData.success) {
      return createError({
        statusCode: 400,
        message: "Invalid input",
        data: validatedData.error.errors, // Send detailed validation errors
      });
    }

    // Ensure at least one field is provided for an update
    if (Object.keys(validatedData.data).length === 0) {
      return createError({ statusCode: 400, message: "No fields to update provided" });
    }

    // Check if the post exists
    const existingPost = await prisma.upazila.findUnique({ where: { id } });
    if (!existingPost) {
      throw createError({ statusCode: 404, message: "Division not found" });
    }

    // Perform the update
    const updatedDivision = await prisma.upazila.update({
      where: { id },
      data: {
        ...validatedData.data
      },
    });

    return { success: true, post: updatedDivision };
  } catch (error) {
    console.error("Error updating Division:", error);
    if (error instanceof Error) {
        return { success: false, error: error.message };
      }
  }
});
