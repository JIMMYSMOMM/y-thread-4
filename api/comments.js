let comments = [
    { post_id: 1, author: "User1", content: "This is a comment on post 1" }
  ];
  
  export default async function handler(req, res) {
    if (req.method === "GET") {
      const { post_id } = req.query;
  
      if (!post_id) {
        res.status(400).json({ error: "post_id is required" });
        return;
      }
  
      // Filter comments for the specific post
      const postComments = comments.filter(comment => comment.post_id == post_id);
      res.status(200).json(postComments);
  
    } else if (req.method === "POST") {
      const { post_id, author, content } = req.body;
  
      if (!post_id || !author || !content) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }
  
      const newComment = {
        post_id: parseInt(post_id),
        author,
        content
      };
  
      comments.push(newComment);
      res.status(201).json({ message: "Comment added", comment: newComment });
  
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  