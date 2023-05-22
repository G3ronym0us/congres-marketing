import { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "../db";
import { stringify } from "querystring";
import { PDFDocument, rgb } from "pdf-lib";
import QRCode from "qrcode";
import nodemailer from "nodemailer";
import { isArray } from "util";

type Data = {
  success: boolean;
};

type Ticket = {
  name: string;
  document: string;
  type: string;
  reference: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const data = req.body;

    const query = `INSERT INTO events (reference, body) 
        VALUES(?, ?)`;
    const result = await excuteQuery({
      query,
      values: [data.data.transaction.reference, JSON.stringify(data)],
    });

    const query2 = `UPDATE tickets SET status = ? WHERE reference = ?`;
    const result2 = await excuteQuery({
      query: query2,
      values: [data.data.transaction.status, data.data.transaction.reference],
    });

    if (data.data.transaction.status == "APPROVED") {
      const query = `SELECT * FROM tickets WHERE reference = ?`;
      const result = await excuteQuery({
        query: query,
        values: [data.data.transaction.reference],
      });      

      if (Array.isArray(result)) {
        result.map(async (user) => {
          const document = "document" in user ? user.document : null;
          const name = "name" in user ? user.name : null;
          const lastname = "lastname" in user ? user.lastname : null;
          const email = "email" in user ? user.email : null;
          const type = "type" in user ? user.type : null;

          const pdfDoc = await PDFDocument.create();
          const page = pdfDoc.addPage();

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

          const imageTextUrl =
            process.env.NEXT_PUBLIC_URL + "images/pdf-text.png";

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

          // Add Icon

          let iconURL = process.env.NEXT_PUBLIC_URL + "images/silla.png";
          switch (type) {
            case "Diamante":
              iconURL = process.env.NEXT_PUBLIC_URL + "images/diamante.png";
              break;
            case "Oro":
              iconURL =
                process.env.NEXT_PUBLIC_URL + "images/lingotes-de-oro.png";
              break;
            default:
              iconURL = process.env.NEXT_PUBLIC_URL + "images/silla.png";
              break;
          }

          const iconResponse = await fetch(iconURL);
          if (!iconResponse.ok) {
            throw new Error("Failed to fetch the image");
          }

          const iconBuffer = await iconResponse.arrayBuffer();
          const imageIcon = await pdfDoc.embedPng(iconBuffer);
          page.drawImage(imageIcon, {
            x: 77,
            y: 453,
            width: 18,
            height: 18,
          });

          // Agrega el código QR
          const qrCodeUrl = "https://cnmpcolombia.com/ticket/" + document;
          const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl);
          const qrCodeImage = await pdfDoc.embedPng(qrCodeDataUrl);
          console.log(page.getWidth(), page.getHeight());
          page.drawImage(qrCodeImage, {
            x: 383,
            y: 66,
            width: 150,
            height: 150,
          });

          page.drawText(name, {
            x: 77, // Posición horizontal del texto en la página
            y: 582, // Posición vertical del texto en la página
            size: 34, // Tamaño de fuente del texto
            font: await pdfDoc.embedFont("Helvetica"), // Fuente del texto (puedes cargar otras fuentes)
            color: rgb(1, 1, 1), // Color del texto (en este caso, negro)
          });

          page.drawText(lastname, {
            x: 77, // Posición horizontal del texto en la página
            y: 532, // Posición vertical del texto en la página
            size: 24, // Tamaño de fuente del texto
            font: await pdfDoc.embedFont("Helvetica"), // Fuente del texto (puedes cargar otras fuentes)
            color: rgb(1, 1, 1), // Color del texto (en este caso, negro)
          });

          page.drawText(`LOCALIDAD: ${type}`, {
            x: 105, // Posición horizontal del texto en la página
            y: 451, // Posición vertical del texto en la página
            size: 10, // Tamaño de fuente del texto
            font: await pdfDoc.embedFont("Helvetica"), // Fuente del texto (puedes cargar otras fuentes)
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
              user: "info@cnmpcolombia.com",
              pass: "C0ngr3ssYesid**",
            },
          });

          const mailOptions = {
            from: "info@cnmpcolombia.com",
            to: email,
            subject: "Adjunto: PDF con imagen y código QR",
            text: "Adjunto encontrarás el PDF con la imagen y el código QR.",
            attachments: [
              {
                filename: "image_with_qr.pdf",
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
        });
      }else{
        console.error("No es un aarray:");
        res.status(500).send({ success: false });
      }
    }
  } catch (error) {
    console.log("Err: " + error);
  }
}
