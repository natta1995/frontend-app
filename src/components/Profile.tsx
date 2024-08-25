import React, { useState, useEffect } from 'react';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:1337/users/profile', {
          method: 'GET',
          credentials: 'include', // Skicka cookies för sessionen
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
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1>Min Profil</h1>
      <p><strong>Användarnamn:</strong> {profile.username}</p>
      <p><strong>Namn:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Ålder:</strong> {profile.age}</p>
      <p><strong>Arbetsplats:</strong> {profile.workplace}</p>
      <p><strong>Skola:</strong> {profile.school}</p>
      <p><strong>Bio:</strong> {profile.bio}</p>
    </div>
  );
};

export default Profile;
