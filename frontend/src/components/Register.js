import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate,Navigate } from 'react-router-dom'

const Register = () => {

    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleNameChange = (e) => {
        setName(e.target.value);
        setNameError('')
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailError('')
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordError('');
    };

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        const formData = new FormData
        formData.append('name', name)
        formData.append('email', email)
        formData.append('password', password)
        
        try {
            const res = await axios.post(`http://127.0.0.1:8000/api/register`, formData)
            sessionStorage.setItem('token', res.data.token)
            navigate('/home')
        } catch (error) {
            if (error.response.data?.name) {
                setNameError(error.response.data?.name[0])
                setLoading(false)
            }
            if (error.response.data?.email) {
                setEmailError(error.response.data?.email[0])
                setLoading(false)
            }
            if (error.response.data?.password) {
                setPasswordError(error.response.data?.password[0])
                setLoading(false)
            }
        }
    };

    if (sessionStorage.getItem('token')) {
        return <Navigate to='/home' />
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="w-50">
                <h1 style={{ textAlign: 'center' }}>Register Form</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            isInvalid={!!nameError}
                            onChange={handleNameChange}
                            style={{ width: '100%' }}
                        />
                        <Form.Control.Feedback type="invalid">{nameError}</Form.Control.Feedback>
                    </Form.Group>

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

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Button variant="primary" type="submit" className='my-3' style={{ textAlign: 'center' }}>
                            {loading ? 'loading...' : 'Submit'}
                        </Button>
                        <Link to="/login">Login</Link>
                    </div>
                </Form>
            </div>
        </Container>
    );
}

export default Register;
