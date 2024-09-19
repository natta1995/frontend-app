import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Button, Form } from "react-bootstrap";

type Comment = {
  id: number;
  username: string;
  content: string;
  createdAt: string;
  user_id: number;
};

type CommentProps = {
  postId: number;
  currentUser: string;
};

const Comments: React.FC<CommentProps> = ({ postId, currentUser }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");

 
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:1337/feed/${postId}/comments`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          console.error("Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [postId]);


  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:1337/feed/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const createdComment = await response.json();
        setComments([...comments, createdComment]);
        setNewComment("");
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  
  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await fetch(`http://localhost:1337/feed/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setComments(comments.filter((comment) => comment.id !== commentId));
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
    console.log("Trying to delete comment with ID:", commentId);

  };

  return (
    <div className="comments-section">
      <h6>Kommentarer:</h6>
      {comments.map((comment) => (
        <div key={comment.id} style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ccc" }}>
          <div>
          <strong>{comment.username} säger:</strong>
          <p>{comment.content}</p>
          <p style={{ fontSize: "0.8em", color: "#555" }}>
            {new Date(comment.createdAt).toLocaleString()}
          </p>
          </div>
          <div>
          {comment.username === currentUser && (
            <Button variant="danger" onClick={() => handleDeleteComment(comment.id)}>
               <FontAwesomeIcon icon={faTrashCan} />
            </Button>
          )}
          </div>
        </div>
      ))}

      <Form  onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Skriv en kommentar..."
          style={{ width: "100%", padding: "10px", marginBottom: "10px", height: "60px" }}
        />
        <div style={{display: "flex", justifyContent: "flex-end"}}>
        <Button type="submit">Skicka</Button>
        </div>
      </Form>
    </div>
  );
};

export default Comments;
