import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate,Navigate } from 'react-router-dom'

const Login = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordError('');
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailError('')
    };

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        const formData = new FormData
        formData.append('email', email)
        formData.append('password', password)
        
        try {
            const res = await axios.post(`http://127.0.0.1:8000/api/login`, formData)
            sessionStorage.setItem('token', res.data.token)
            navigate('/home')
            setLoading(false)
        } catch (error) {
            setLoading(false)
            setError(error.response.data?.message)
            setTimeout(()=>{setError('')}, 5000)
            if (error.response.data?.email) {
                setEmailError(error.response.data?.email[0])
            }
            if (error.response.data?.password) {
                setPasswordError(error.response.data?.password[0])
            }
        }
    };

    if (sessionStorage.getItem('token')) {
        return <Navigate to='/home' />
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="w-50">
            <h1 style={{ textAlign: 'center' }}>Login Form</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        isInvalid={!!emailError}
                        onChange={handleEmailChange}
                        style={{ width: '100%' }}
                    />
                    <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        isInvalid={!!passwordError}
                        onChange={handlePasswordChange}
                        style={{ width: '100%' }}
                    />
                    <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
                </Form.Group>

                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <Button variant="primary" type="submit" className='my-3' style={{ textAlign: 'center' }}>
                        {loading ? 'loading...' : 'Login'}
                    </Button>
                    <Link to="/">Register</Link>
                </div>
            </Form>
        </div>
    </Container>
    );
}

export default Login;
