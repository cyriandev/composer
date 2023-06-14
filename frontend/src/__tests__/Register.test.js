import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import Register from '../components/Register.js';

jest.mock('axios');

describe('Register component', () => {
  afterEach(() => {
    sessionStorage.clear();
    jest.resetAllMocks();
  });

  test('renders without errors', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(screen.getByText('Register Form')).toBeInTheDocument();
  });

  test('registers successfully', async () => {
    const mockedResponse = {
      data: {
        token: 'mocked-token',
      },
    };
    axios.post.mockResolvedValueOnce(mockedResponse);

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    expect(submitButton).toHaveTextContent('loading...');

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/api/register',
        expect.any(FormData)
      );
      expect(sessionStorage.getItem('token')).toEqual('mocked-token');
      expect(screen.getByText('Register Form')).not.toBeInTheDocument();
    });
  });

  test('displays validation error if name is missing', async () => {
    const errorResponse = {
      response: {
        data: {
          name: ['The name field is required.'],
        },
      },
    };
    axios.post.mockRejectedValueOnce(errorResponse);

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const submitButton = screen.getByText('Submit');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(screen.getByText('The name field is required.')).toBeInTheDocument();
      expect(sessionStorage.getItem('token')).toBeNull();
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
        <Register />
      </MemoryRouter>
    );

    const submitButton = screen.getByText('Submit');

    fireEvent.click(submitButton);

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
        <Register />
      </MemoryRouter>
    );

    const submitButton = screen.getByText('Submit');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(screen.getByText('The password field is required.')).toBeInTheDocument();
      expect(sessionStorage.getItem('token')).toBeNull();
    });
  });

  test('navigates to login if already registered', () => {
    sessionStorage.setItem('token', 'mocked-token');

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.queryByText('Register Form')).not.toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});
