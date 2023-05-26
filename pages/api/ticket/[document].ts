import { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "../db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { document } = req.query;
    const query = "SELECT * FROM tickets WHERE status = ? AND document = ?";
    const status = "APPROVED";
    const result = await excuteQuery({
      query,
      values: [status, document],
    });

    if(Array.isArray(result)){
        res.status(200).json(result[0]);
        return;
    }

    res.status(200).json(null);
    return;
  } catch (error) {
    console.log(error);
    return error;
  }
}
