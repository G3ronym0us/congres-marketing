import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import excuteQuery from "../db";
import { serialize } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      // Obtén los datos del usuario del cuerpo de la solicitud
      const { username, password } = req.body;

      const query = "SELECT * FROM users WHERE username = ?";
      const result = await excuteQuery({
        query,
        values: [username],
      });

      const user = getUser(result);
      if (!user) {
        res.status(401).json({ message: "Credenciales inválidas" });
        return;
      }

      // Compara la contraseña ingresada con la contraseña almacenada
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.status(401).json({ message: "Credenciales inválidas" });
        return;
      }

      // Si el registro es exitoso, devuelve una respuesta con el token JWT o un mensaje de éxito
      const token = generateToken({ id: user.id, username: user.username });

      // Establece la cookie con el token
      const cookies = serialize("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400, // Tiempo de expiración de la cookie en segundos (1 día en este ejemplo)
        sameSite: "strict",
        path: "/",
      });

      // Devuelve el token en la respuesta
      res.setHeader('Set-Cookie', cookies);
      res.status(200).json({ message: "Login Exitoso" });
    } else {
      // Si se realiza una solicitud de un método diferente a POST, devuelve un error 405 (Método no permitido)
      res.status(405).end();
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}

type User = {
  id: number;
  username: string;
};

// Función para generar un token JWT
export function generateToken(payload: User) {
  // Aquí debes proporcionar una clave secreta para firmar el token
  const secretKey = "Pt6HjLhoM3Pt6HjLhoM3";

  // Genera el token con el payload y la clave secreta
  const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

  return token;
}

// Función para verificar y decodificar un token JWT
export function verifyToken(token: string) {
  // Aquí debes proporcionar la misma clave secreta utilizada para firmar el token
  const secretKey = "Pt6HjLhoM3Pt6HjLhoM3";

  try {
    // Verifica y decodifica el token
    const decoded = jwt.verify(token, secretKey);

    return decoded;
  } catch (error) {
    // Si el token no es válido, se lanzará una excepción
    return null;
  }
}

function getUser(result: object) {
  if (Array.isArray(result)) {
    return result[0];
  }
  return null;
}
