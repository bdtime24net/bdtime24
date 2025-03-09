import { defineEventHandler, H3Event } from 'h3';
import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { id } = event.context.params || {};  // Safely destructure `id` from `params`

    if (!id) {
      throw new Error('Tag ID is required');
    }

    // Delete the post with the provided ID
    await prisma.newsCategory.delete({
      where: { id: String(id) },
    });

    return { success: true, message: 'Tag deleted successfully' };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
});