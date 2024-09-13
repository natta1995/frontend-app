import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const EditProfile: React.FC = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: "",
    workplace: "",
    school: "",
    bio: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:1337/users/profile", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:1337/users/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        navigate("/profile");
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      style={{
        width: "70%",
        margin: "0 auto",
        padding: "10%",
        paddingTop: "5%",
      }}
    >
      <Form.Group controlId="formName">
        <Form.Label>Namn</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formAge">
        <Form.Label>Ålder</Form.Label>
        <Form.Control
          type="number"
          name="age"
          value={profile.age}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formWorkplace">
        <Form.Label>Arbetsplats</Form.Label>
        <Form.Control
          type="text"
          name="workplace"
          value={profile.workplace}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formSchool">
        <Form.Label>Skola</Form.Label>
        <Form.Control
          type="text"
          name="school"
          value={profile.school}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formBio">
        <Form.Label>Bio</Form.Label>
        <Form.Control
          as="textarea"
          name="bio"
          value={profile.bio}
          onChange={handleChange}
        />
      </Form.Group>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "5%",
        }}
      >
        <Button variant="primary" type="submit">
          Uppdatera Profil
        </Button>
        <Button variant="danger" onClick={() => navigate("/profile")}>
          Avbryt
        </Button>
      </div>
    </Form>
  );
};

export default EditProfile;
