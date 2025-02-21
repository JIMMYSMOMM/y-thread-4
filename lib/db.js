import mysql from 'mysql';

const db = mysql.createConnection({
  host: 'localhost', // Update with your DB host or connection string for Vercel
  user: 'root',      // Update with your DB username
  password: 'yourpassword',  // Update with your DB password
  database: 'my_database'    // Update with your DB name
});

export default db;
