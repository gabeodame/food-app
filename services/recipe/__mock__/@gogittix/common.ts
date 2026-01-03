export const currentUser = (req: any, res: any, next: any) => {
  req.currentUser = { id: "test-user-id" }; // ✅ Fake user for tests
  next();
};

export const requireAuth = (req: any, res: any, next: any) => {
  if (!req.currentUser) {
    return res.status(401).json({ error: "Unauthorized request" });
  }
  next();
};

export const validateRequest = (_req: any, _res: any, next: any) => {
  next();
};

export const errorHandler = (_err: any, _req: any, res: any, _next: any) => {
  res.status(500).json({ error: "Test error handler" });
};

export class NotAuthorizedError extends Error {
  constructor() {
    super("Not authorized");
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}
