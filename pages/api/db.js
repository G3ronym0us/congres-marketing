import mysql from 'mysql2/promise';

export default async function excuteQuery({ query, values }) {

  const db = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  });

  const [result] = await db.query(query, values);
  return result;

}