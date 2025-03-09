import prisma from "~/server/utils/prisma"; // Import Prisma client
import bcrypt from "bcryptjs";
import { defineEventHandler, readBody, createError } from "h3"; // Make sure to import necessary types
import {createUserSchema} from './validation'


export default defineEventHandler (async (event) => {
    try {
        // validation req body
        const body = await readBody(event);
        const validatedData = createUserSchema.safeParse(body)
        if (!validatedData.success) {
            throw createError({ statusCode: 400, message: "Invalid input" })
        }

        //  check email already exist
        const existingUser = await prisma.user.findUnique({ where: { email: validatedData.data.email}
        })    
        if (existingUser) {
            throw createError({ statusCode: 400, statusMessage: "User with this already exists" })
        }

        // password hashing
        const hashedPassword = await bcrypt.hash(validatedData.data.password, 10);


        const ipAddressHeader = event.node.req.headers['x-forwarded-for'];
const ipAddress = Array.isArray(ipAddressHeader) ? ipAddressHeader[0] : ipAddressHeader || event.node.req.socket.remoteAddress || 'Unknown';


        // create user
        const user = await prisma.user.create({
            data: {
                ...validatedData.data,
                password: hashedPassword,
                ipAddress,
                userAgent: event.node.req.headers['user-agent'] || 'Unknown',
            }
        });

        return { 
            message: "User created successfully",
            user: {
                id: user.id,
                email: user.email
            }
         };



    } catch (error) {
        const statusCode = (error as any).statusCode || 500;
        return createError({ statusCode, message: (error as any).message || "Something went wrong" });
    }
})