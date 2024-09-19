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

  // Hämta kommentarer för detta inlägg
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

  // Lägg till en ny kommentar
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

  // Ta bort en kommentar
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
        <div key={comment.id} style={{ marginBottom: "10px" }}>
          <strong>{comment.username} säger:</strong>
          <p>{comment.content}</p>
          <p style={{ fontSize: "0.8em", color: "#555" }}>
            {new Date(comment.createdAt).toLocaleString()}
          </p>
          {comment.username === currentUser && (
            <Button variant="danger" onClick={() => handleDeleteComment(comment.id)}>
               <FontAwesomeIcon icon={faTrashCan} />
            </Button>
          )}
        </div>
      ))}

      {/* Lägg till en kommentar */}
      <Form onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Skriv en kommentar..."
          style={{ width: "100%", padding: "10px", marginBottom: "10px", height: "60px" }}
        />
        <Button type="submit">Skicka</Button>
      </Form>
    </div>
  );
};

export default Comments;
