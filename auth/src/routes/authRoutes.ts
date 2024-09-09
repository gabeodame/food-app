import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { authController } from "../controllers/authControllers";
import { validateRequest, requireAuth, currentUser } from "@gogittix/common"; // Adjust based on your project
import { NextFunction } from "express-serve-static-core";

const router = Router();

// Signup route
router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, token } = await authController.signup(req);

      // Set session and respond
      req.session = { jwt: token };
      res.status(201).send(user);
    } catch (error) {
      next(error); // Pass any errors to the global error handler
    }
  }
);

// Signin route
router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password must be supplied"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, token } = await authController.signin(req);

      // Set session and respond
      req.session = { jwt: token };
      res.status(200).send(user);
    } catch (error) {
      next(error); // Pass any errors to the global error handler
    }
  }
);

// Signout route
router.post("/api/users/signout", (req, res) => {
  // Clear session
  req.session = null;
  res.send({});
});

// Current User route
router.get(
  "/api/users/currentuser",
  currentUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = await authController.currentUser(req);
      res.send(currentUser);
    } catch (error) {
      next(error);
    }
  }
);

export { router as authRoutes };
