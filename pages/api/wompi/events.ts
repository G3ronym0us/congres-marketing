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
      values: ['data.data.transaction.reference', JSON.stringify(data)],
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
  }
}
