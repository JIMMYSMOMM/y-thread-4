export default async function handler(req, res) {
  if (req.method === 'GET') {
    db.query('SELECT * FROM users', (err, result) => {
      if (err) {
        console.error('Database query error:', err); // Log the error
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(result);
    });
  } else if (req.method === 'POST') {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
    db.query(sql, [name, email], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err); // Log the error
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        message: `User '${name}' created successfully!`,
        userId: result.insertId
      });
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
