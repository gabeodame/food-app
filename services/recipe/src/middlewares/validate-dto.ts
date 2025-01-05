import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";

export function validateDto(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToInstance(dtoClass, req.body);
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length > 0) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.map((err: any) => ({
            property: err.property,
            constraints: err.constraints,
          })),
        });
      }

      next();
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  };
}
