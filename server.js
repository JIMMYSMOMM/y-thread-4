const express = require('express');
const mysql = require('mysql');
const cors = require('cors');  // ✅ Import CORS

const app = express();
const port = 3000;

app.use(cors()); // ✅ Allow requests from any origin
app.use(express.json()); // ✅ Enable JSON parsing

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'gayfurryvore', // Change if needed
    database: 'my_database'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Get users
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(result);
    });
});

// ✅ Delete user by name
app.delete('/users/name/:username', (req, res) => {
    const username = req.params.username;
    const sql = 'DELETE FROM users WHERE name = ?';

    db.query(sql, [username], (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send({ message: 'User not found' });
            return;
        }
        res.send({ message: `User '${username}' deleted successfully` });
    });
});

// ✅ Create a new user
app.post('/users', (req, res) => {
    const { name, email } = req.body; // Assuming users have a name & email

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
    db.query(sql, [name, email], (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(201).json({ message: `User '${name}' created successfully!`, userId: result.insertId });
    });
});

// ✅ Create a new post
app.post('/posts', (req, res) => {
    const { title, creatorname, base, tcr, tcg, tcb } = req.body;

    if (!title || !creatorname || !base) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    const sql = `INSERT INTO posts (title, creatorname, base, tcr, tcg, tcb) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(sql, [title, creatorname, base, tcr, tcg, tcb], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err });
        }

        res.status(201).json({ 
            message: "Post created successfully!", 
            postId: result.insertId // Return the new post ID
        });
    });
});




// ✅ Get a post by title
app.get('/posts/title/:title', (req, res) => {
    const title = req.params.title;

    const sql = 'SELECT * FROM posts WHERE title = ? LIMIT 1';
    db.query(sql, [title], (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        res.json(result[0]);
    });
});

app.get('/posts', (req, res) => {
    const sql = "SELECT id, title, creatorname, base, tcr, tcg, tcb FROM posts ORDER BY id DESC";
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: "Database error", details: err });
        } else {
            res.json(results);
        }
    });
});



// ✅ Delete a post by title
app.delete('/posts/title/:title', (req, res) => {
    const title = req.params.title;
    const sql = 'DELETE FROM posts WHERE title = ?';

    db.query(sql, [title], (err, result) => {
        if (err) {
            res.status(500).json({ error: "Error deleting post", details: err });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.json({ message: `Post '${title}' deleted successfully` });
    });
});


app.post('/comments', (req, res) => {
    const { post_id, author, content } = req.body;

    console.log("Received Comment Data:", req.body); // Log the received data

    if (!post_id || !author || !content) {
        console.error("Missing required fields:", req.body);
        return res.status(400).json({ message: "Post ID, author, and content are required." });
    }

    const sql = "INSERT INTO comments (post_id, author, content) VALUES (?, ?, ?)";
    db.query(sql, [post_id, author, content], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }

        res.status(201).json({ message: "Comment added successfully!" });
    });
});


app.get('/comments/:post_id', (req, res) => {
    const { post_id } = req.params;
    const sql = "SELECT * FROM comments WHERE post_id = ? ORDER BY timestamp DESC";

    db.query(sql, [post_id], (err, results) => {
        if (err) {
            res.status(500).json({ error: "Database error", details: err });
        } else {
            res.json(results);
        }
    });
});


// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
