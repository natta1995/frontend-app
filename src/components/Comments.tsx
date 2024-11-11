import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileImg from "../Img/startimg.webp";
import styled from "styled-components";
import {
  faTrashCan,
  faAngleUp,
  faAngleDown,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

const CommentContainer = styled.div`
  padding: 1%;
  border-top: 2px solid #ccc;
  justify-content: space-between;
  background-color: #faedcd;
`;

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
};

const Comments: React.FC<CommentProps> = ({ postId }) => {
  const { currentUser } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:1337/feed/${postId}/comments`,
          {
            method: "GET",
            credentials: "include",
          }
        );

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
      const response = await fetch(
        `http://localhost:1337/feed/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ content: newComment }),
        }
      );

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
      const response = await fetch(
        `http://localhost:1337/feed/comments/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

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
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            height: "60px",
          }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            style={{ backgroundColor: "#bc6c25", borderColor: "#bc6c25" }}
            type="submit"
          >
            Kommentera
          </Button>
        </div>
      </Form>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {comments.length > 0 ? (
          <Button
            onClick={toggleCommentsVisibility}
            style={{
              marginBottom: "10px",
              marginTop: "10px",
              backgroundColor: "#faedcd",
              color: "black",
              borderColor: "#faedcd",
            }}
          >
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
        ) : (
          ""
        )}
      </div>

      {isVisible && (
        <div>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentContainer key={comment.id}>
                <div
                  style={{
                    paddingLeft: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{}}
                    onClick={() => navigate(`/profile/${comment.username}`)}
                  >
                    <img
                      src={
                        comment.profile_image
                          ? `http://localhost:1337${comment.profile_image}`
                          : ProfileImg
                      }
                      alt={`${comment.username}s profile`}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        marginRight: "10px",
                      }}
                    />

                    <strong style={{ marginTop: "5px" }}>
                      {comment.username}
                    </strong>

                    <p
                      style={{
                        marginTop: "5px",
                        marginLeft: "15px",
                      }}
                    >
                      {comment.content}
                    </p>
                  </div>

                  <div style={{}}>
                    {comment.username === currentUser?.username && (
                      <Dropdown className="ms-auto">
                        <Dropdown.Toggle
                          variant="ghostSecondary"
                          id="dropdown-basic"
                        >
                          <FontAwesomeIcon icon={faEllipsis} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item>
                            <Button
                              variant="danger"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <FontAwesomeIcon icon={faTrashCan} /> Radera
                              inlägg
                            </Button>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </div>
                </div>
                <p
                  style={{
                    fontSize: "0.8em",
                    color: "#555",
                    textAlign: "right",
                    marginBottom: "0px",
                    paddingBottom: "0px",
                    paddingTop: "15px",
                  }}
                >
                  {new Date(comment.created_at).toLocaleString()}
                </p>
              </CommentContainer>
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
