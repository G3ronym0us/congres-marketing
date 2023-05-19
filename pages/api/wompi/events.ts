import { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "../db";
import { stringify } from "querystring";

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

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
  }
}
