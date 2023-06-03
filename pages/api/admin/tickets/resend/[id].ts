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
    const query = "SELECT * FROM tickets WHERE status = ? AND id = ?";
    const status = "APPROVED";
    const result = await excuteQuery({
      query,
      values: [status, id],
    });

    if (Array.isArray(result) && result[0]) {
      const id = "id" in result[0] ? result[0].id : "";
      const document = "document" in result[0] ? result[0].document : "";
      const name = "name" in result[0] && result[0].name ? result[0].name : "";
      const lastname = "lastname" in result[0] && result[0].lastname ? result[0].lastname : "";
      const email = "email" in result[0] && result[0].email ? result[0].email : "yesidguinand2012@gmail.com";
      const type = "type" in result[0] ? result[0].type : "";
      const number = "number" in result[0] ? result[0].number : "";
      const row = "row" in result[0] ? result[0].row : "";
      const role = "role" in result[0] ? result[0].role : "";
      const user: Ticket = {
        id,
        name,
        lastname,
        email,
        document,
        type,
        role,
        number,
        row,
      };
      await resendEmail(user);
      //   if (confirm) {
      //     console.error("Error al enviar el correo electrónico");
      //     return res.status(500).send({ success: false });
      //   } else {
      //     console.log("Correo electrónico enviado");
      //     return res.status(200).send({ success: true });
      //   }
      return res.status(200).json(true);;
    }

    res.status(200).json(null);
    return;
  } catch (error) {
    res.status(200).json({ message: "Error" });
    console.log(error);
    return;
  }
};

async function resendEmail(user: Ticket) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const page = pdfDoc.addPage();

  const fontBytes = await fetch(
    process.env.NEXT_PUBLIC_URL + "fonts/Garet-Heavy.ttf"
  ).then((res) => res.arrayBuffer());
  const customFont = await pdfDoc.embedFont(fontBytes);

  // Agrega la imagen
  const imageUrl = process.env.NEXT_PUBLIC_URL + "images/pdf-img-template.png";

  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error("Failed to fetch the image");
  }

  const imageBuffer = await imageResponse.arrayBuffer();
  const image = await pdfDoc.embedPng(imageBuffer);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: page.getWidth(),
    height: page.getHeight(),
  });

  let imageTextUrl =
    process.env.NEXT_PUBLIC_URL + "images/pdf-text-general.png";
  switch (user.type) {
    case "Diamante":
      imageTextUrl =
        process.env.NEXT_PUBLIC_URL + "images/pdf-text-diamante.png";
      break;
    case "Oro":
      imageTextUrl = process.env.NEXT_PUBLIC_URL + "images/pdf-text-oro.png";
      break;
    case "Platea Derecha":
      imageTextUrl = process.env.NEXT_PUBLIC_URL + "images/pdf-tex-plateat.png";
      break;
    case "Platea Izquierda":
      imageTextUrl = process.env.NEXT_PUBLIC_URL + "images/pdf-text-platea.png";
      break;
    default:
      imageTextUrl =
        process.env.NEXT_PUBLIC_URL + "images/pdf-text-general.png";
      break;
  }

  const imageTextResponse = await fetch(imageTextUrl);
  if (!imageTextResponse.ok) {
    throw new Error("Failed to fetch the image");
  }

  const imgeTextBuffer = await imageTextResponse.arrayBuffer();
  const imageText = await pdfDoc.embedPng(imgeTextBuffer);
  page.drawImage(imageText, {
    x: 0,
    y: 0,
    width: page.getWidth(),
    height: page.getHeight(),
  });

  // Agrega el código QR
  const qrCodeUrl = "https://cnmpcolombia.com/ticket/" + user.document;
  const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl);
  const qrCodeImage = await pdfDoc.embedPng(qrCodeDataUrl);
  console.log(page.getWidth(), page.getHeight());
  page.drawImage(qrCodeImage, {
    x: 383,
    y: 66,
    width: 150,
    height: 150,
  });

  page.drawText(user.name, {
    x: 77, // Posición horizontal del texto en la página
    y: 572, // Posición vertical del texto en la página
    size: 38, // Tamaño de fuente del texto
    font: customFont, // Fuente del texto (puedes cargar otras fuentes)
    color: rgb(1, 1, 1), // Color del texto (en este caso, negro)
  });

  page.drawText(user.lastname, {
    x: 77, // Posición horizontal del texto en la página
    y: 532, // Posición vertical del texto en la página
    size: 28, // Tamaño de fuente del texto
    font: customFont, // Fuente del texto (puedes cargar otras fuentes)
    color: rgb(1, 1, 1), // Color del texto (en este caso, negro)
  });

  page.drawText(user.document, {
    x: 77, // Posición horizontal del texto en la página
    y: 504, // Posición vertical del texto en la página
    size: 28, // Tamaño de fuente del texto
    font: customFont, // Fuente del texto (puedes cargar otras fuentes)
    color: rgb(1, 1, 1), // Color del texto (en este caso, negro)
  });

  page.drawText(`${user.row} ${user.number}`, {
    x: 77, // Posición horizontal del texto en la página
    y: 532, // Posición vertical del texto en la página
    size: 14, // Tamaño de fuente del texto
    font: customFont, // Fuente del texto (puedes cargar otras fuentes)
    color: rgb(1, 1, 1), // Color del texto (en este caso, negro)
  });

  const pdfBytes = await pdfDoc.save();
  const pdfBuffer = Buffer.from(pdfBytes);

  // Configura el transportador de nodemailer
  const transporter = nodemailer.createTransport({
    // Configura los detalles del servicio de correo electrónico que usarás
    // Aquí se muestra un ejemplo usando Gmail. Asegúrate de proporcionar tus propias credenciales y detalles del servidor SMTP.
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure: false,
    auth: {
      user: "cnmpcolombia@gmail.com",
      pass: "MGaQ7gtTZkIUAsrw",
    },
  });

  const mailOptions = {
    from: "info@cnmpcolombia.com",
    to: user.email,
    subject: "Confirmación de Participación CNMP",
    text: `
            ¡Enhorabuena!
            Haz asegurado tu cupo para participar del Congreso Nacioal de Marketing Político - Colombia 2023.
            
            Recuerda asistir puntual a las conferencias y actividades programadas, y seguir las instrucciones de nuestro personal logístico.
            
            Lugar: Auditorio mayor Carlos Gómez Albarracín UNAB, Bucaramanga, Colombia.
            
            Fecha: 14 y 15 de julio de 2023.
            
            Si requieres información, escríbenos a cnmmcolombia@gmail.com o a nuestro WhatsApp 3160557600
            
            ¡Te esperamos!`,
    attachments: [
      {
        filename: "image_with_qr.pdf",
        content: pdfBuffer,
      },
    ],
  };

  // Envía el correo electrónico
  const send = await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return false;
    } else {
      return true;
    }
  });
}

// Aplica el middleware de autenticación a la ruta protegida
const protectedRoute = authenticateMiddleware(protectedRouteHandler);

export default protectedRoute;
