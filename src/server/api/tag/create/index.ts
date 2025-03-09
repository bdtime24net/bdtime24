import { defineEventHandler, readBody, createError } from "h3";
import prisma from "~/server/utils/prisma";
import { createTagSchema } from "../validation";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = createTagSchema.safeParse(body);

    if (!validatedData.success) {
      throw createError({ statusCode: 400, message: "Invalid input" });
    }

    // Check if the tag already exists
    const existingTag = await prisma.tag.findUnique({
      where: { name: validatedData.data.name },
    });

    if (existingTag) {
      throw createError({
        statusCode: 400,
        statusMessage: "Tag with this name already exists",
      });
    }

    // Create new tag
    const tag = await prisma.tag.create({
      data: {
        name: validatedData.data.name,
      },
    });

    return { success: true, tag };
  } catch (error) {
    console.error("Error occurred:", error);
    return createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
