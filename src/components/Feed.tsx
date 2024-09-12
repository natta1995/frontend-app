import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import ProfileImg from '../startimg.webp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

const BoxContainer = styled.div` 
  padding: 5%;
  border-radius: 10px;
  border: 1px solid #d3efe5;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  margin-bottom: 5%;
`

type Post = {
  id: number;
  username: string;
  content: string;
  createdAt: string;
};

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]); 
  const [newPost, setNewPost] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:1337/feed', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          console.error('Failed to fetch posts');
        }

        // Hämta nuvarande användares username
        const userResponse = await fetch('http://localhost:1337/users/profile', {
          method: 'GET',
          credentials: 'include',
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setCurrentUser(userData.username); // Sätt användarnamnet i state
        } else {
          console.error('Failed to fetch current user');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPosts();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:1337/feed/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content: newPost }),
      });

      if (response.ok) {
        const createdPost: Post = await response.json();
        setPosts([createdPost, ...posts]);
        setNewPost('');
      } else {
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleDelete = async (postId: number) => { 
    try {
      const response = await fetch(`http://localhost:1337/feed/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId));
      } else {
        console.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  

  return (
    <div style={{ margin: '0 auto',  padding: "3%", width: "70%", height: "auto"}}>
      <h1>Välkommen tillbaka {currentUser} !</h1>
      <Form onSubmit={handlePostSubmit}>
        <h6>Vad vill du dela med dig av idag?</h6>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Vad vill du dela?"
          style={{ width: '100%', padding: '10px', marginBottom: '10px', height: '100px' }}
        />
        <Button type="submit" style={{ padding: '10px 20px' }}>Publicera Inlägg</Button>
      </Form>
    
      <div style={{ marginTop: '20px' }}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <BoxContainer>
            <div key={post.id} style={{ borderBottom: '1px solid #ccc', padding: '10px 0'}}>
              <p><strong
              onClick={() => navigate(`/profile/${post.username}`)} // Navigera till användarens profil
              >
                 <img src={ProfileImg} alt="StartProfileImg" style={{ width: '40px', height: 'auto', borderRadius: "50%" }} />
                 {post.username}</strong> säger:</p>
              <p>{post.content}</p>
              <p style={{ fontSize: '0.8em', color: '#555' }}>{new Date(post.createdAt).toLocaleString()}</p>
              {post.username === currentUser && ( 
                <Button onClick={() => handleDelete(post.id)} variant="danger"><FontAwesomeIcon icon={faTrashCan}/> </Button>
              )}
             
            </div>
            </BoxContainer>
          ))
        ) : (
          <p>Inga inlägg tillgängliga.</p>
        )}
      </div>
      
    </div>
      
  );
};

export default Feed;



