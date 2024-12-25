import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import { BadRequestError, NotAuthorizedError } from "@gogittix/common"; // Adjust based on your project
import { PasswordManager } from "../services/password-manager";

export class AuthController {
  // Business logic for signing up users
  async signup(req: Request) {
    const { email, password, username } = req.body;

    if (!email || !username) {
      throw new BadRequestError("Either email or username is required");
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    console.log(existingUser);
    if (existingUser) {
      throw new BadRequestError("Email already in use");
    }

    const user = User.build({ email, password, username });
    await user.save();

    return { message: "User created successfully" };
  }

  // Business logic for signing in users
  async signin(req: Request) {
    const { email, password, username } = req.body;

    const identifier = email || username;
    if (!identifier) {
      throw new BadRequestError("Either email or username is required");
    }

    // Query by email or username based on which is provided
    const user = await User.findOne(email ? { email } : { username });
    if (!user) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordsMatch = await PasswordManager.compare(
      user.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    // Generate JWT
    const userJwt = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_KEY!
    );

    // Set JWT in cookie for authenticated sessions
    req.session = { jwt: userJwt };

    // Return the authenticated user
    return { user, token: userJwt };
  }

  // Business logic for signing out users
  signout(req: Request) {
    // Return null to indicate the session should be cleared
    return {};
  }

  // Business logic for getting the current user
  currentUser(req: Request) {
    // Return the current user from the request
    return { currentUser: req.currentUser || null };
  }

  // Change password method
  async changePassword(req: Request) {
    const { currentPassword, newPassword } = req.body;

    //validate input
    if (!currentPassword || !newPassword) {
      throw new BadRequestError(
        "Current password and new  password are required"
      );
    }

    //get authenticated user
    const userId = req.currentUser?.id;
    if (!userId) {
      throw new NotAuthorizedError();
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new NotAuthorizedError();
    }

    //verify current password
    const passwordsMatch = await PasswordManager.compare(
      user.password,
      currentPassword
    );

    if (!passwordsMatch) {
      throw new BadRequestError("Enter correct credentials");
    }
  }
}

export const authController = new AuthController();
