import { defineEventHandler, readBody, createError } from "h3"
import prisma from "~/server/utils/prisma"
import {createCategorySchema} from '../validation'



export default defineEventHandler(async (event) => {
    try {
      const body = await readBody(event)
      const validatedData = createCategorySchema.safeParse(body)
      if (!validatedData.success) {
        throw createError({ statusCode: 400, message: "Invalid input" })
      }
  
   // check post already exist
      const existingPost = await prisma.newsCategory.findUnique({
        where: { name: validatedData.data.name },
      })
      if (existingPost) {
        throw createError({ statusCode: 400, statusMessage: "Category already exists" })
      }
  
      const post = await prisma.newsCategory.create({
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