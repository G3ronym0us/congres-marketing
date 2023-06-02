import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends NextApiRequest {
  user: any; // Define la estructura de tu objeto de usuario
}

// Middleware de autenticación
export const authenticateMiddleware =
  (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) =>
  async (req: AuthenticatedRequest, res: NextApiResponse) => {
    // Verifica si se proporciona el token de autenticación en los headers
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Token de autenticación no proporcionado" });
    }

    try {
      // Verifica y decodifica el token
      const decoded = jwt.verify(token, "Pt6HjLhoM3Pt6HjLhoM3"); // Reemplaza 'secret-key' por tu clave secreta real

      // Agrega la información del usuario al objeto 'req' para que esté disponible en los controladores posteriores
      req.user = decoded;

      // Ejecuta el controlador original
      await handler(req, res);
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Token de autenticación inválido" });
    }
  };
