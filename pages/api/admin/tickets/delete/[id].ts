import { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "../../../db";
import { authenticateMiddleware } from "@/utils/authMiddleware";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import QRCode from "qrcode";
import nodemailer from "nodemailer";

interface AuthenticatedRequest extends NextApiRequest {
  user: any; // Define la estructura de tu objeto de usuario
}

type Ticket = {
  id: number;
  name: string;
  lastname: string;
  email: string;
  document: string;
  type: string;
  role: string;
  number: number;
  row: string;
};

// Ruta protegida con autenticación
const protectedRouteHandler = async (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => {
  try {
    // Accede a la información del usuario desde 'req.user'
    const user = req.user;

    const { id } = req.query;
    const query = "DELETE FROM tickets WHERE id = ?";
    const result = await excuteQuery({
      query,
      values: [id],
    });

    res.status(200).json(true);
    return;
  } catch (error) {
    res.status(400).json({ message: "Error" });
    console.log(error);
    return;
  }
};

// Aplica el middleware de autenticación a la ruta protegida
const protectedRoute = authenticateMiddleware(protectedRouteHandler);

export default protectedRoute;
