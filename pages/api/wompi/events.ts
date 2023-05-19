import { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "../db";
import { stringify } from "querystring";
import { PDFDocument } from "pdf-lib";
import QRCode from "qrcode";
import nodemailer from "nodemailer";

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
    const imageSize = image.scale(0.5); // Escala la imagen al 50%
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: page.getHeight(),
    });

    // Agrega el código QR
    const qrCodeUrl = "https://example.com";
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl);
    const qrCodeImage = await pdfDoc.embedPng(qrCodeDataUrl);
    const qrCodeSize = qrCodeImage.scale(0.5); // Escala el código QR al 30%
    console.log(page.getWidth(), page.getHeight());
    page.drawImage(qrCodeImage, {
      x: 383,
      y: 66,
      width: 150,
      height: 150,
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
      to: "diohandres1703@gmail.com",
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
  } catch (error) {
    console.log("Err: " + error);
  }
}
