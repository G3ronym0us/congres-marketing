import mysql from 'mysql2';
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD
});
export default async function excuteQuery({ query, values }) {
  try {
    db.query(query, values, (err, result, fields) => {
      console.log(err);
      console.log(result); // results contains rows returned by server
      console.log(fields);
      return result;

    });

  } catch (error) {
    return { error };
  }
}