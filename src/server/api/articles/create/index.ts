import { defineEventHandler, readBody, createError, getHeader } from "h3"
import prisma from "~/server/utils/prisma"
import {createPostSchema} from '../validation'



export default defineEventHandler(async (event) => {
    try {
      const body = await readBody(event)
      const validatedData = createPostSchema.safeParse(body)
      if (!validatedData.success) {
        throw createError({ statusCode: 400, message: "Invalid input" })
      }
  
   // check post already exist
      const existingPost = await prisma.article.findUnique({
        where: { slug: validatedData.data.slug }
      })
      if (existingPost) {
        throw createError({ statusCode: 400, statusMessage: "Post with this slug already exists" })
      }
  
      const post = await prisma.article.create({
        data: {
          ...validatedData.data,
      }
      })
      
      
      return { success: true, post }
    } catch (error) {
      console.error("Error occurred:", error) 
      return createError({
        
        statusCode: 500,
  
        statusMessage: "Internal Server Error",
      })
    }
  })