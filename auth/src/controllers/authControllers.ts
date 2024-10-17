import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import { BadRequestError, NotAuthorizedError } from "@gogittix/common"; // Adjust based on your project
import { PasswordManager } from "../services/password-manager";

export class AuthController {
  // Business logic for signing up users
  async signup(req: Request) {
    const { email, password, username } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new BadRequestError("Email already in use");
    }

    const user = User.build({ email, password, username });
    await user.save();

    // Generate JWT and store in session
    const userJwt = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    );

    // Return the user and token, but do not send the response here
    return { user, token: userJwt };
  }

  // Business logic for signing in users
  async signin(req: Request) {
    const { email, password, username } = req.body;

    const user = await User.findOne({ $or: [{ email }, { username }] });
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

    // Generate JWT and return the user and token
    const userJwt = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    );

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
