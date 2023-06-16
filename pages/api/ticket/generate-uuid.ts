import { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "../db";
import { randomBytes } from "crypto";

type Ticket = {
  id: number;
  uuid: number;
  name: string;
  lastname: string;
  email: string;
  document: string;
  type: string;
  role: string;
  number: number;
  row: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const query = "SELECT * FROM tickets WHERE status = ?";
    const status = "APPROVED";
    const result = await excuteQuery({
      query,
      values: [status],
    });

    if (Array.isArray(result)) {
      result.map(async (ticket) => {
        const id = "id" in ticket ? ticket.id : "";
        const document = "document" in ticket ? ticket.document : "";
        const uuid = "uuid" in ticket ? ticket.uuid : "";
        const name = "name" in ticket && ticket.name ? ticket.name : "";
        const lastname =
          "lastname" in ticket && ticket.lastname ? ticket.lastname : "";
        const email =
          "email" in ticket && ticket.email
            ? ticket.email
            : "yesidguinand2012@gmail.com";
        const type = "type" in ticket ? ticket.type : "";
        const number = "number" in ticket ? ticket.number : "";
        const row = "row" in ticket ? ticket.row : "";
        const role = "role" in ticket ? ticket.role : "";
        const user: Ticket = {
          id,
          uuid,
          name,
          lastname,
          email,
          document,
          type,
          role,
          number,
          row,
        };

        const uuidNew = await generateRandomString(20);
        const query = "UPDATE tickets SET uuid = ? WHERE id = ?";
        const result2 = await excuteQuery({
          query,
          values: [uuidNew, user.id],
        });
      });
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function generateRandomString(length: number) {
  const bytes = await randomBytes(Math.ceil(length / 2));
  return bytes.toString("hex").slice(0, length);
}
