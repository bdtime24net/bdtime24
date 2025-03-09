import { defineEventHandler, readBody, createError } from "h3"
import prisma from "~/server/utils/prisma"
import {upazilaSchema} from '../validation'



export default defineEventHandler(async (event) => {
    try {
      const body = await readBody(event)
      const validatedData = upazilaSchema.safeParse(body)
      if (!validatedData.success) {
        throw createError({ statusCode: 400, message: "Invalid input" })
      }
  
   // check Upazila already exist
      const existingUpazila = await prisma.upazila.findFirst({
        where: { name: validatedData.data.name },
      })
      if (existingUpazila) {
        throw createError({ statusCode: 400, statusMessage: "Upazila with this name already exists in the district" })
      }
  
      const upazila = await prisma.upazila.create({
        data: {
            ...validatedData.data
        }
      })
      
      
      return { success: true, message: "Upazila created successfully",   data: upazila,  }
    } catch (error) {
      console.error("Error occurred:", error) 
      return createError({
        
        statusCode: 500,
  
        statusMessage: "Internal Server Error",
      })
    }
  })