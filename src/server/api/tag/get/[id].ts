import { defineEventHandler, createError, readBody } from "h3";
import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;
    const { name } = await readBody(event);

    if (!name || !id) {
      throw createError({ statusCode: 400, statusMessage: "Invalid data" });
    }

    const updatedTag = await prisma.tag.update({
      where: { id },
      data: { name },
    });

    return { success: true, data: updatedTag };
  } catch (error) {
    console.error("Update error:", error);
    throw createError({ statusCode: 500, statusMessage: "Internal Server Error" });
  }
});
