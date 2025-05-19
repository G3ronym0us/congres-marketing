import { randomBytes } from 'crypto';

export async function generateRandomString(length: number) {
  const bytes = await randomBytes(Math.ceil(length / 2));
  return bytes.toString('hex').slice(0, length);
}

export const numberWithDots = (value: number) => {
  const formattedValue = value.toLocaleString('en-US', { useGrouping: true });
  return formattedValue.replace(/,/g, '.');
};

export const generateReference = () => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `CNP-${timestamp}-${randomStr}`;
};