import prisma from "~/server/utils/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { defineEventHandler, readBody, createError } from "h3";

const SECRET_KEY = process.env.JWT_SECRET;

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password } = body;

    if (!email || !password) {
      throw createError({ statusCode: 400, message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw createError({ statusCode: 404, message: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw createError({ statusCode: 401, message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY as string, { expiresIn: "1h" });

    return { message: "Login successful", token };
  } catch (error) {
    const statusCode = 500;
    const errorMessage = "Something went wrong";
    return createError({ statusCode, message: errorMessage });
  }
});