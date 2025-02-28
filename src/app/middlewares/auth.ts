import authConfig from "../../config/auth";
import { NextFunction } from "express";
import Jwt from "jsonwebtoken";

function authMiddleware(request, response, next: NextFunction) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).json({ error: "Token não fornecido" });
  }

  const token = authToken.split(" ")[1];

  try {
    Jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        throw new Error("Token inválido");
      }

      request.userId = decoded.id;
      request.userName = decoded.name;
      next();
    });
  } catch (err) {
    return response.status(401).json({ error: "O token é inválido" });
  }
}

export default authMiddleware;
