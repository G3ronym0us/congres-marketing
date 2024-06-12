import { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "../db";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import QRCode from "qrcode";
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";

type Data = {
  success: boolean;
};

type Ticket = {
  uuid: string;
  name: string;
  lastname: string;
  email: string;
  document: string;
  type: string;
  role: string;
  seatNumber: number;
  seatRow: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const data = req.body;
    const uuid = await generateRandomString(20);

    if (data.code != "Pt6HjLhoM3") {
      res.status(401).json({ success: false });
      return;
    }

    await Promise.all(
      data.tickets.map(async (ticket: Ticket) => {
        const query =
          "INSERT INTO tickets (uuid, document, type, reference, number, `row`, status) VALUES(?, ?, ?, ?, ?, ?, ?)";
        const result = await excuteQuery({
          query,
          values: [
            uuid,
            ticket.document,
            ticket.type,
            data.code,
            ticket.seatNumber,
            ticket.seatRow,
            "APPROVED",
          ],
        });
        console.log(result);

        const pdfDoc = await PDFDocument.create();
        pdfDoc.registerFontkit(fontkit);
        const page = pdfDoc.addPage();

        const fontBytes = await fetch(
          process.env.NEXT_PUBLIC_URL + "fonts/Garet-Heavy.ttf"
        ).then((res) => res.arrayBuffer());
        const customFont = await pdfDoc.embedFont(fontBytes);

        // Agrega la imagen
        const imageUrl =
          process.env.NEXT_PUBLIC_URL + "images/pdf-img-template.png";

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
        switch (ticket.type) {
          case "Diamante":
            imageTextUrl =
              process.env.NEXT_PUBLIC_URL + "images/pdf-text-diamante.png";
            break;
          case "Oro":
            imageTextUrl =
              process.env.NEXT_PUBLIC_URL + "images/pdf-text-oro.png";
            break;
          case "Platea Derecha":
            imageTextUrl =
              process.env.NEXT_PUBLIC_URL + "images/pdf-text-platea.png";
            break;
          case "Platea Izquierda":
            imageTextUrl =
              process.env.NEXT_PUBLIC_URL + "images/pdf-text-platea.png";
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
        const qrCodeUrl = "https://cnmpcolombia.com/ticket/" + ticket.uuid;
        const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl);
        const qrCodeImage = await pdfDoc.embedPng(qrCodeDataUrl);
        console.log(page.getWidth(), page.getHeight());
        page.drawImage(qrCodeImage, {
          x: 383,
          y: 66,
          width: 150,
          height: 150,
        });

        page.drawText(ticket.document, {
          x: 77, // Posición horizontal del texto en la página
          y: 504, // Posición vertical del texto en la página
          size: 28, // Tamaño de fuente del texto
          font: customFont, // Fuente del texto (puedes cargar otras fuentes)
          color: rgb(1, 1, 1), // Color del texto (en este caso, negro)
        });

        page.drawText(`${ticket.seatRow} ${ticket.seatNumber}`, {
          x: 85, // Posición horizontal del texto en la página
          y: 435, // Posición vertical del texto en la página
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
          host: "smtp.hostinger.com",
          port: 465,
          secure: true,
          auth: {
            user: "Info2@cnmpcolombia.com",
            pass: "3st0esProd123*",
          },
        });

        const mailOptions = {
          from: "info2@cnmpcolombia.com",
          to: 'yesidguinand2012@gmail.com',
          subject: "Confirmación de Participación CNMP",
          text: `
              ¡Enhorabuena!
              Haz asegurado tu cupo para participar del Congreso Nacioal de Marketing Político - Colombia 2023.
              
              Recuerda asistir puntual a las conferencias y actividades programadas, y seguir las instrucciones de nuestro personal logístico.
              
              Lugar: Auditorio mayor Carlos Gómez Albarracín UNAB, Bucaramanga, Colombia.
              
              Fecha: 14 y 15 de julio de 2023.
              
              Si requieres información, escríbenos a cnmmcolombia@gmail.com o a nuestro WhatsApp 3181200000
              
              ¡Te esperamos!`,
          attachments: [
            {
              filename: "QR-"+ ticket.document +".pdf",
              content: pdfBuffer,
            },
          ],
        };

        // Envía el correo electrónico
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error al enviar el correo electrónico:", error);
            res.status(500).send({ success: false });
          } else {
            console.log("Correo electrónico enviado:", info.response);
            res.status(200).send({ success: true });
          }
        });
      })
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function generateRandomString(length: number) {
  const bytes = await randomBytes(Math.ceil(length / 2));
  return bytes.toString("hex").slice(0, length);
}