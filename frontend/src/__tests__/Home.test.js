import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import Home from '../components/Home.js';

jest.mock('axios');

describe('Home component', () => {
  beforeEach(() => {
    sessionStorage.setItem('token', 'mocked-token');
  });

  afterEach(() => {
    sessionStorage.clear();
    jest.resetAllMocks();
  });

  test('renders without errors', () => {
    render(<Home />);
    expect(screen.getByText('Booking App')).toBeInTheDocument();
  });

  test('creates a booking successfully', async () => {
    const mockedResponse = {
      data: {
        id: 1,
        reason: 'Test Booking',
        date: '2023-06-14',
      },
    };
    axios.post.mockResolvedValueOnce(mockedResponse);

    render(<Home />);

    const reasonInput = screen.getByLabelText('Reason');
    const dateInput = screen.getByLabelText('Date');
    const createButton = screen.getByText('Create');

    fireEvent.change(reasonInput, { target: { value: 'Test Booking' } });
    fireEvent.change(dateInput, { target: { value: '2023-06-14' } });

    fireEvent.click(createButton);

    expect(createButton).toHaveTextContent('wait...');

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/api/book',
        expect.any(FormData),
        {
          headers: {
            Authorization: 'Bearer mocked-token',
            'Content-Type': 'application/json',
          },
        }
      );
      expect(screen.getByLabelText('Reason')).toHaveValue('');
      expect(screen.getByLabelText('Date')).toHaveValue('');
      expect(screen.getByText('Test Booking')).toBeInTheDocument();
      expect(screen.getByText('Date: 2023-06-14')).toBeInTheDocument();
      expect(createButton).toHaveTextContent('Create');
    });
  });

  test('displays validation error if reason is missing', async () => {
    const errorResponse = {
      response: {
        data: {
          reason: ['The reason field is required.'],
        },
      },
    };
    axios.post.mockRejectedValueOnce(errorResponse);

    render(<Home />);

    const createButton = screen.getByText('Create');

    fireEvent.click(createButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(screen.getByText('The reason field is required.')).toBeInTheDocument();
      expect(createButton).toHaveTextContent('Create');
    });
  });

  test('displays validation error if date is missing', async () => {
    const errorResponse = {
      response: {
        data: {
          date: ['The date field is required.'],
        },
      },
    };
    axios.post.mockRejectedValueOnce(errorResponse);

    render(<Home />);

    const createButton = screen.getByText('Create');

    fireEvent.click(createButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(screen.getByText('The date field is required.')).toBeInTheDocument();
      expect(createButton).toHaveTextContent('Create');
    });
  });
});