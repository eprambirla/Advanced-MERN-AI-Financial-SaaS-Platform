import { Request, Response, NextFunction } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logLine = {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      timestamp: new Date().toISOString(),
    };

    if (res.statusCode >= 400) {
      console.error(`[ERROR] ${JSON.stringify(logLine)}`);
    } else {
      console.log(`[INFO] ${JSON.stringify(logLine)}`);
    }
  });

  next();
};
