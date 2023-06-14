import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';
import { Link, useNavigate, Navigate } from 'react-router-dom'
import axios from 'axios';

const Home = () => {

    const [bookings, setBookings] = useState([]);
    const [originalBookings, setOriginalBookings] = useState([]);
    const [reason, setReason] = useState('');
    const [date, setDate] = useState('');
    const [reasonError, setReasonError] = useState('');
    const [dateError, setDateError] = useState('');
    const [activeButton, setActiveButton] = useState('all');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                };
                const res = await axios.get(`http://127.0.0.1:8000/api/getBookings`, config)
                console.log(res.data)
                setOriginalBookings(res.data)
                setBookings(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])

    const handleReasonChange = (e) => {
        setReason(e.target.value);
    };

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    const handleCreateBooking = async () => {
        setLoading(true)
        const config = {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        };

        const formData = new FormData
        formData.append('reason', reason)
        formData.append('date', date)

        try {
            const res = await axios.post(`http://127.0.0.1:8000/api/book`, formData, config)
            console.log(res.data)
            setReason('');
            setDate('');
            const newBooking = {
                reason,
                date,
            };
            setBookings([...bookings, newBooking]);
            setOriginalBookings([...bookings, newBooking]);
            setLoading(false)
        } catch (error) {
            console.log(error.response.data)
            if (error.response.data?.reason) {
                setReasonError(error.response.data?.reason[0])
                setLoading(false)
            }
            if (error.response.data?.date) {
                setDateError(error.response.data?.date[0])
                setLoading(false)
            }
        }
    };

    const filterFutureBookings = () => {
        const futureBookings = originalBookings.filter((booking) => {
            const bookingDate = new Date(booking.date);
            const today = new Date();
            return bookingDate >= today;
        });
        setBookings(futureBookings);
    };

    const filterPastBookings = () => {
        const pastBookings = originalBookings.filter((booking) => {
            const bookingDate = new Date(booking.date);
            const today = new Date();
            return bookingDate < today;
        });
        setBookings(pastBookings);
    };

    const resetBookings = () => {
        setBookings(originalBookings);
    };

    const handleButtonClick = (button) => {
        setActiveButton(button);
    };

    if (!sessionStorage.getItem('token')) {
        return <Navigate to='/' />
    }

    return (
        <Container>
            <h1>Booking App</h1>

            <Row>
                <Col md={5}>
                    <Form>
                        <Form.Group controlId="reason">
                            <Form.Label>Reason</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter reason"
                                value={reason}
                                isInvalid={!!reasonError}
                                onChange={handleReasonChange}
                            />
                            <Form.Control.Feedback type="invalid">{reasonError}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="date">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={date}
                                isInvalid={!!dateError}
                                onChange={handleDateChange}
                            />
                            <Form.Control.Feedback type="invalid">{dateError}</Form.Control.Feedback>
                        </Form.Group>

                        <Button variant="primary" className="m-3" onClick={handleCreateBooking}>
                            {loading ? 'wait...' : 'Create'}
                        </Button>
                    </Form>
                </Col>
                <Col md={6}>
                    <h2>Bookings</h2>
                    <div>
                        <Button className={`m-1 ${activeButton === 'all' ? 'active' : ''}`}
                            onClick={() => { handleButtonClick('all'); resetBookings() }}
                        >All</Button>
                        <Button className={`m-1 ${activeButton === 'future' ? 'active' : ''}`}
                            onClick={() => { handleButtonClick('future'); filterFutureBookings() }}>Future</Button>
                        <Button className={`m-1 ${activeButton === 'past' ? 'active' : ''}`}
                            onClick={() => { handleButtonClick('past'); filterPastBookings() }}>Past</Button>
                    </div>
                    <div className="mt-3" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        <ListGroup className="mt-3">
                            {bookings.map((booking, index) => (
                                <ListGroup.Item key={index} className="m-1">
                                    <p>{booking.reason}</p>
                                    <p>Date: {booking.date}</p>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                </Col>
            </Row>

        </Container>
    );
}

export default Home;
