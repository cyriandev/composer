import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import Login from '../components/Login.js';

jest.mock('axios');

describe('Login component', () => {
  afterEach(() => {
    sessionStorage.clear();
    jest.resetAllMocks();
  });

  test('renders without errors', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByText('Login Form')).toBeInTheDocument();
  });

  test('logs in successfully', async () => {
    const mockedResponse = {
      data: {
        token: 'mocked-token',
      },
    };
    axios.post.mockResolvedValueOnce(mockedResponse);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByText('Login');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(loginButton);

    expect(loginButton).toHaveTextContent('loading...');

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/api/login',
        expect.any(FormData)
      );
      expect(sessionStorage.getItem('token')).toEqual('mocked-token');
      expect(screen.getByText('Login Form')).not.toBeInTheDocument();
    });
  });

  test('displays validation error if email is missing', async () => {
    const errorResponse = {
      response: {
        data: {
          email: ['The email field is required.'],
        },
      },
    };
    axios.post.mockRejectedValueOnce(errorResponse);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const loginButton = screen.getByText('Login');

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(screen.getByText('The email field is required.')).toBeInTheDocument();
      expect(sessionStorage.getItem('token')).toBeNull();
    });
  });

  test('displays validation error if password is missing', async () => {
    const errorResponse = {
      response: {
        data: {
          password: ['The password field is required.'],
        },
      },
    };
    axios.post.mockRejectedValueOnce(errorResponse);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const loginButton = screen.getByText('Login');

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(screen.getByText('The password field is required.')).toBeInTheDocument();
      expect(sessionStorage.getItem('token')).toBeNull();
    });
  });

  test('displays error message if login fails', async () => {
    const errorResponse = {
      response: {
        data: {
          message: 'Invalid credentials',
        },
      },
    };
    axios.post.mockRejectedValueOnce(errorResponse);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByText('Login');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(loginButton);

    expect(loginButton).toHaveTextContent('loading...');

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      expect(sessionStorage.getItem('token')).toBeNull();
    });
  });
});
