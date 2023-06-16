import { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "../db";
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

    await Promise.all(
      data.tickets.map(async (ticket: Ticket) => {
        const query =
          "INSERT INTO tickets (uuid, name, lastname, email, document, type, reference, role, number, `row`) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const result = await excuteQuery({
          query,
          values: [
            uuid,
            ticket.name,
            ticket.lastname,
            ticket.email,
            ticket.document,
            ticket.type,
            data.reference,
            ticket.role,
            ticket.seatNumber,
            ticket.seatRow,
          ],
        });
        console.log(result);
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
