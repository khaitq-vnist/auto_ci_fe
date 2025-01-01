'use client';

import authService from '@/utils/api/auth.service';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../context/auth_context';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('All fields are required');
            return;
        }

        try {
            setLoading(true);
            const response = await authService.loginUser(email, password);

            if (response?.status === 200 && response?.data?.data?.access_token) {
                console.log('Login successful:', response.data.data);
                // Save the access token to localStorage or cookies
                login(response.data.data.access_token);
                // Set user authentication (if you have global state or context)
                toast.success('Login successful!');
                router.push('/dashboard'); // Redirect user after successful login
            } else {
                toast.error('Invalid login credentials');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            toast.error(error?.response?.data?.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '400px' }}>
                <Card.Body>
                    <h3 className="text-center mb-4">Login</h3>
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            Login
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        <small>
                            Don't have an account? <a href="/register">Register</a>
                        </small>
                    </div>
                </Card.Body>
            </Card>
            <ToastContainer />
        </Container>

    );
};

export default LoginPage;
