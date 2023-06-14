import { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "../db";
import { PDFDocument, rgb } from "pdf-lib";
import QRCode from "qrcode";
import nodemailer from "nodemailer";
import fontkit from "@pdf-lib/fontkit";

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

    // const query = `INSERT INTO events (reference, body)
    //     VALUES(?, ?)`;
    // const result = await excuteQuery({
    //   query,
    //   values: [data.data.transaction.reference, JSON.stringify(data)],
    // });

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
          const number = "number" in user ? user.number : null;
          const row = "row" in user ? user.row : null;

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
          switch (type) {
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
                process.env.NEXT_PUBLIC_URL + "images/pdf-tex-plateat.png";
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
            y: 572, // Posición vertical del texto en la página
            size: 38, // Tamaño de fuente del texto
            font: customFont, // Fuente del texto (puedes cargar otras fuentes)
            color: rgb(1, 1, 1), // Color del texto (en este caso, negro)
          });

          page.drawText(lastname, {
            x: 77, // Posición horizontal del texto en la página
            y: 532, // Posición vertical del texto en la página
            size: 28, // Tamaño de fuente del texto
            font: customFont, // Fuente del texto (puedes cargar otras fuentes)
            color: rgb(1, 1, 1), // Color del texto (en este caso, negro)
          });

          page.drawText(document, {
            x: 77, // Posición horizontal del texto en la página
            y: 504, // Posición vertical del texto en la página
            size: 28, // Tamaño de fuente del texto
            font: customFont, // Fuente del texto (puedes cargar otras fuentes)
            color: rgb(1, 1, 1), // Color del texto (en este caso, negro)
          });

          page.drawText(`${row} ${number}`, {
            x: 77, // Posición horizontal del texto en la página
            y: 431, // Posición vertical del texto en la página
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
            secure: false,
            auth: {
              user: "info@cnmpcolombia.com",
              pass: "3st0esProd123*",
            },
          });

          const mailOptions = {
            from: "info@cnmpcolombia.com",
            to: email,
            subject: "Confirmación de Participación CNMP",
            text: `
            ¡Enhorabuena!
            Haz asegurado tu cupo para participar del Congreso Nacioal de Marketing Político - Colombia 2023.
            
            Recuerda asistir puntual a las conferencias y actividades programadas, y seguir las instrucciones de nuestro personal logístico.

            En el Congreso Nacional de Marketing Político queremos asegurarnos de que tu experiencia sea la mejor, incluyendo tu alojamiento. 

Para tu descanso después de un día lleno de aprendizaje, nos complace recomendarte el Hotel Bari, reconocido por su excelencia en servicio y comodidad, su ubicación estratégica a tres cuadras de la Universidad Autónoma de Bucaramanga, facilitan el acceso a nuestro evento. 

En él recibirás tarifas exclusivas, acreditando con tu entrada que participarás en el Congreso Nacional de Marketing Político. 

¡Te invitamos a vivir una experiencia excepcional en el Congreso Nacional de Marketing Político y disfrutar de la comodidad y hospitalidad del Hotel Bari! 

Tarifa de alojamiento por noche en habitación estándar queen o twin (dos camas) $210.000 + IVA.
Incluye desayuno en barra tipo buffet.
No incluye seguro hotelero de $8.100 por persona por noche
            
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
      } else {
        console.error("No es un aarray:");
        res.status(500).send({ success: false });
      }
    }
  } catch (error) {
    console.log("Err: " + error);
  }
}
