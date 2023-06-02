import { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "../db";
import { authenticateMiddleware } from "@/utils/authMiddleware";

interface AuthenticatedRequest extends NextApiRequest {
  user: any; // Define la estructura de tu objeto de usuario
}

// Ruta protegida con autenticación
const protectedRouteHandler = async (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => {
  // Accede a la información del usuario desde 'req.user'
  const user = req.user;

  try {
    const query = "SELECT * FROM tickets WHERE status = ?";
    const status = "APPROVED";
    const result = await excuteQuery({
      query,
      values: [status],
    });

    if (Array.isArray(result)) {
      res.status(200).json(result);
      return;
    }

    res.status(200).json(null);
    return;
  } catch (error) {
    res.status(200).json({ message: "Error" });
    console.log(error);
    return;
  }
};

// Aplica el middleware de autenticación a la ruta protegida
const protectedRoute = authenticateMiddleware(protectedRouteHandler);

export default protectedRoute;
