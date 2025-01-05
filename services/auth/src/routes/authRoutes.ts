import { Router, Request, Response } from "express";
import { body, oneOf } from "express-validator";
import { authController } from "../controllers/authControllers";
import { validateRequest, requireAuth, currentUser } from "@gogittix/common"; // Adjust based on your project
import { NextFunction } from "express-serve-static-core";

const router = Router();

router.get("/test", (req, res) => {
  console.log("Test route");
  res.send("You are authenticated");
});

router.get("/protected", requireAuth, (req, res) => {
  res.send("You are authenticated");
});

// Signup route
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("username")
      .notEmpty()
      .withMessage("Username is required if email is not provided"),

    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { message } = await authController.signup(req);

      // Set session and respond
      // req.session = { jwt: token };
      res.status(201).send({ message });
    } catch (error) {
      next(error); // Pass any errors to the global error handler
    }
  }
);

// Signin route
router.post(
  "/signin",
  [
    oneOf([
      body("email").isEmail().withMessage("Please provide a valid email"),
      body("username")
        .notEmpty()
        .withMessage("Username is required if email is not provided"),
    ]),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Signin route");
    try {
      const { user, token } = await authController.signin(req);
      console.log(user, token);

      // Set session and respond
      req.session = { jwt: token };
      res.status(200).send(user);
    } catch (error) {
      next(error); // Pass any errors to the global error handler
    }
  }
);

// Signout route
router.post("/signout", (req, res) => {
  // Clear session
  req.session = null;
  res.send({});
});

// Current User route
router.get(
  "/currentuser",
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
