import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import excuteQuery from "../db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const token = req.headers.authorization;
      console.log(token);

      if (token != "Pt6HjLhoM3") {
        res.status(401).json({ message: "No tienes los permisos necesarios" });
        return;
      }

      // Obtén los datos del usuario del cuerpo de la solicitud
      const { username, password } = req.body;

      // Genera un salt para el hashing
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);

      // Hashea la contraseña
      const hashedPassword = await bcrypt.hash(password, salt);

      const query = "INSERT INTO users (username, password) VALUES(?, ?)";
      const result = await excuteQuery({
        query,
        values: [username, hashedPassword],
      });
      // Si el registro es exitoso, devuelve una respuesta con el token JWT o un mensaje de éxito
      res.status(200).json({ message: "Registro exitoso" });
    } else {
      // Si se realiza una solicitud de un método diferente a POST, devuelve un error 405 (Método no permitido)
      res.status(405).end();
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}
