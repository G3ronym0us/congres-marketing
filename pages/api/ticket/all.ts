import { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "../db";

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
    
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    return error;
  }
}
