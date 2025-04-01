import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/register", { username, password });
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Register</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Form.Group>
        <Button className="mt-3" variant="primary" type="submit">Register</Button>
      </Form>
      <p className="mt-3">
        Not registered? <Link to="/login">Login here</Link>
      </p>
    </Container>
  );
};

export default Register;
