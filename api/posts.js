// api/posts.js

export default async function handler(req, res) {
    // Use an in-memory array for testing purposes (later, this should connect to a database)
    let posts = [
      { id: 1, creatorname: "User1", title: "First Post", base: "This is a test post", tcr: 255, tcg: 0, tcb: 0 }
    ];
  
    if (req.method === "GET") {
      // Return all posts
      res.status(200).json(posts);
    } else if (req.method === "POST") {
      const { creatorname, title, base, tcr, tcg, tcb } = req.body;
  
      if (!creatorname || !title || !base) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }
  
      const newPost = {
        id: posts.length + 1,
        creatorname,
        title,
        base,
        tcr,
        tcg,
        tcb
      };
  
      posts.push(newPost);
      res.status(201).json({ message: "Post created", post: newPost });
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  