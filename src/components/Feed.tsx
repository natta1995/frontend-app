import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

type Post = {
  id: number;
  username: string;
  content: string;
  createdAt: string;
};

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]); 
  const [newPost, setNewPost] = useState<string>('');

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
      } catch (error) {
        console.error('Error fetching posts:', error);
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
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1>Här är ditt flöde</h1>
      <Link to="/profile" > Min profil </Link>
      <form onSubmit={handlePostSubmit}>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Vad vill du dela?"
          style={{ width: '100%', padding: '10px', marginBottom: '10px', height: '100px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Skapa Inlägg</button>
      </form>

      <div style={{ marginTop: '20px' }}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
              <p><strong>{post.username}</strong> says:</p>
              <p>{post.content}</p>
              <p style={{ fontSize: '0.8em', color: '#555' }}>{new Date(post.createdAt).toLocaleString()}</p>
              <button onClick={() => handleDelete(post.id)}>Ta Bort</button>
            </div>
          ))
        ) : (
          <p>Inga inlägg tillgängliga.</p>
        )}
      </div>
    </div>
  );
};

export default Feed;



