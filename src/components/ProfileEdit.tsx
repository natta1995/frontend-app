import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGears } from "@fortawesome/free-solid-svg-icons";

const EditProfile: React.FC = () => {
  const [show, setShow] = useState(false);
  const { currentUser, setCurrentUser } = useUser();
  const [profile, setProfile] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    age: currentUser?.age || "",
    workplace: currentUser?.workplace || "",
    school: currentUser?.school || "",
    bio: currentUser?.bio || "",
    profile_image: currentUser?.profile_image || "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("email", profile.email);
    formData.append("age", String(profile.age));
    formData.append("workplace", profile.workplace);
    formData.append("school", profile.school);
    formData.append("bio", profile.bio);

    if (profileImage) {
      formData.append("image", profileImage);
    } else if (profile.profile_image) {
      formData.append("profile_image", profile.profile_image);
    }

    try {
      const response = await fetch("http://localhost:1337/users/profile", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        const responseText = await response.text();
        console.log("Serverns svar:", responseText);

        const updatedProfileResponse = await fetch(
          "http://localhost:1337/users/profile",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (updatedProfileResponse.ok) {
          const updatedUser = await updatedProfileResponse.json();
          console.log("Uppdaterad användare:", updatedUser);
          setCurrentUser(updatedUser);
          navigate("/profile");
          console.error("Failed to fetch updated profile");
        }
      } else {
        console.error("Failed to update profile, status:", response.status);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      <Button
        variant="primary"
        style={{ backgroundColor: "#606c38", borderColor: "#606c38" }}
        onClick={handleShow}
      >
        <FontAwesomeIcon icon={faGears} />
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>Ändra Profil</Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={handleSubmit}
            style={{
              width: "100%",
              padding: "10%",
              paddingTop: "3%",
              paddingBottom: "3%",
              backgroundColor: "#faedcd",
              marginTop: "3%",
              marginBottom: "3%",
            }}
          >
            <Form.Group controlId="formProfileImage">
              <Form.Label>Profilbild:</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const fileInput = e.target as HTMLInputElement;
                  setProfileImage(fileInput.files ? fileInput.files[0] : null);
                }}
              />
            </Form.Group>

            <Form.Group controlId="formName">
              <Form.Label>Namn:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formAge">
              <Form.Label>Ålder:</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={profile.age}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formWorkplace">
              <Form.Label>Arbetsplats:</Form.Label>
              <Form.Control
                type="text"
                name="workplace"
                value={profile.workplace}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formSchool">
              <Form.Label>Skola:</Form.Label>
              <Form.Control
                type="text"
                name="school"
                value={profile.school}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBio">
              <Form.Label>Bio:</Form.Label>
              <Form.Control
                as="textarea"
                name="bio"
                value={profile.bio}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{display: "flex", justifyContent: "space-between", margin: "5%"}}>
        <Button variant="success" type="submit" onClick={handleSubmit}>
                Uppdatera
              </Button>
          <Button variant="secondary" onClick={handleClose}>
                Stäng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditProfile;
