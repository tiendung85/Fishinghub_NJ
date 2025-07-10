import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";
import "../../assets/styles/login.css";

function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = await login(email, password);
        console.log("User after login:", user); // Thêm dòng này để kiểm tra
        if (user) {
            if (user.role === 3) {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } else {
            setError("Sai email hoặc mật khẩu");
        }
    };


    return (
        <Container className="login-center" >
            <div className="login-row shadow rounded bg-white border overflow-hidden">
                <div className="col-md-6 p-0">
                    <div className="login-wrap p-4 p-lg-5 h-100 d-flex flex-column justify-content-center">
                        <div className="d-flex mb-4 align-items-center justify-content-between">
                            <h3 className="mb-0">Sign In</h3>

                        </div>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit} className="signin-form">
                            <Form.Group className="mb-3">
                                <Form.Label className="label" htmlFor="email">
                                    Email
                                </Form.Label>
                                <Form.Control
                                    id="email"
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="label" htmlFor="password">
                                    Password
                                </Form.Label>
                                <Form.Control
                                    id="password"
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 d-flex justify-content-between align-items-center">

                                <a href="#" className="text-decoration-none">
                                    Forgot Password?
                                </a>
                            </Form.Group>
                            <div className="form-group">
                                <Button
                                    type="submit"
                                    className="form-control btn btn-primary submit px-3"
                                >
                                    Sign In
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
                <div className="col-md-6 bg-primary text-white text-center d-flex align-items-center justify-content-center order-md-last p-4 p-lg-5">
                    <div className="w-100">
                        <h2>Welcome</h2>
                        <p>Don't have an account?</p>
                        <a href="#" className="btn btn-outline-light">
                            Sign Up
                        </a>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default Login;