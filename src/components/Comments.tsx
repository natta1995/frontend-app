import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileImg from "../startimg.webp";
import { faTrashCan, faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { Button, Form } from "react-bootstrap";


type Comment = {
  id: number;
  username: string;
  content: string;
  created_at: string;
  user_id: number;
  profile_image: string;
};

type CommentProps = {
  postId: number;
  currentUser: string;
};

const Comments: React.FC<CommentProps> = ({ postId, currentUser }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
 

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:1337/feed/${postId}/comments`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          const transformedData = data.map((comment: Comment) => ({
            ...comment,
            createdAt: new Date(comment.created_at), 
          }));
          setComments(transformedData);
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

  const toggleCommentsVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="comments-section">
       <Form onSubmit={handleCommentSubmit}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Skriv en kommentar..."
              style={{ width: "100%", padding: "10px", marginBottom: "10px", height: "60px" }}
            />
            <Button type="submit">Skicka</Button>
          </Form>
    <div style={{ display: "flex", justifyContent: "flex-end"}}>
      {comments.length > 0 ? (
      <Button onClick={toggleCommentsVisibility} style={{ marginBottom: "10px", marginTop: "10px" }}>
        {isVisible ? (
        <>
      Dölj kommentarer <FontAwesomeIcon icon={faAngleUp} />
        </>
  ) : (
    <>
    Visa kommentarer <FontAwesomeIcon icon={faAngleDown} />
    </>
     )}
      </Button>
      ): (
        <h6>Ingen har kommenterat detta inlägg ännu</h6>
      )}
    </div>
      {isVisible && ( 
        <div>
          <h6>Kommentarer:</h6>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
        
                <img
                        src={
                          comment.profile_image
                            ? `http://localhost:1337${comment.profile_image}`
                            : ProfileImg
                        }
                        alt="Profile Image"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          marginRight: "10px",
                        }}
                      />
      
                  <strong>{comment.username} säger:</strong>
                  <p>{comment.content}</p>
                  <p style={{ fontSize: "0.8em", color: "#555" }}>
                  {new Date(comment.created_at).toLocaleString()}
                  </p>
                </div>
                {comment.username === currentUser && (
                  <Button variant="danger" onClick={() => handleDeleteComment(comment.id)} style={{ marginLeft: "10px" }}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p>Inga kommentarer ännu.</p>
          )}

         
        </div>
      )}
    </div>
  );
};

export default Comments;
