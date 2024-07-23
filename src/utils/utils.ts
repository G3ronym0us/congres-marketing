import { randomBytes } from "crypto";

export async function generateRandomString(length: number) {
    const bytes = await randomBytes(Math.ceil(length / 2));
    return bytes.toString('hex').slice(0, length);
  }