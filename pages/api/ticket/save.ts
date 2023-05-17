import { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "../db";

type Data = {
  success: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const data = req.body;
    console.log(data);
    
    const query = `INSERT INTO tickets (name, document, type) 
                        VALUES(?, ?, ?)`;
    const result = await excuteQuery({
      query,
      values: [data.name, data.document, data.type],
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
}
