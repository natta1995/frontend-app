import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
//import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const ProfileContainer = styled.div`
  background-color: #d3efe5;  
  padding: 10%;
  border-radius: 10px;
  border: 1px solid #d3efe5;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
`

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:1337/users/profile', {
          method: 'GET',
          credentials: 'include', 
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          setError('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Error fetching profile');
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileContainer style={{ width: "70%", margin: '0 auto' }}>
      <h1>{profile.name}</h1>
      <p><strong>Användarnamn:</strong> {profile.username}</p>
      <p><strong>Namn:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Ålder:</strong> {profile.age}</p>
      <p><strong>Arbetsplats:</strong> {profile.workplace}</p>
      <p><strong>Skola:</strong> {profile.school}</p>
      <p><strong>Bio:</strong> {profile.bio}</p>
    </ProfileContainer>
  );
};

export default Profile;
