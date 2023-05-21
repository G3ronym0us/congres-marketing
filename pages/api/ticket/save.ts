import { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "../db";

type Data = {
  success: boolean;
};

type Ticket = {
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

    await Promise.all(
      data.tickets.map(async (ticket: Ticket) => {
        const query =
          "INSERT INTO tickets (name, lastname, email, document, type, reference, role, number, `row`) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const result = await excuteQuery({
          query,
          values: [
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
