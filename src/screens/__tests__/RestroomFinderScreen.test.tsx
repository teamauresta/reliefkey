import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import { RestroomFinderScreen } from '../RestroomFinderScreen';
import * as Location from 'expo-location';

// Mock the fetch calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        {
          id: 1,
          name: 'Test Restroom',
          street: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          country: 'US',
          latitude: 37.775,
          longitude: -122.419,
          accessible: true,
          unisex: true,
          directions: 'Down the hall',
        },
      ]),
  } as Response),
);

describe('RestroomFinderScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Restore default location mocks (clearAllMocks wipes implementations)
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: 37.7749, longitude: -122.4194 },
    });
    (fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 1,
              name: 'Test Restroom',
              street: '123 Main St',
              city: 'San Francisco',
              state: 'CA',
              country: 'US',
              latitude: 37.775,
              longitude: -122.419,
              accessible: true,
              unisex: true,
              directions: 'Down the hall',
            },
          ]),
      } as Response),
    );
  });

  it('shows loading state while getting location', () => {
    // Make location hang
    (Location.getCurrentPositionAsync as jest.Mock).mockImplementation(
      () => new Promise(() => {}),
    );

    render(<RestroomFinderScreen />);
    expect(screen.getByText('Finding your location...')).toBeTruthy();
  });

  it('shows error state when location denied', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      status: 'denied',
    });

    render(<RestroomFinderScreen />);

    await waitFor(() => {
      expect(screen.getByText('Location Required')).toBeTruthy();
      expect(screen.getByText('Location permission denied')).toBeTruthy();
    });
  });

  it('renders map and markers after location acquired', async () => {
    render(<RestroomFinderScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('map-view')).toBeTruthy();
    });

    // Should have at least one marker from the mocked API
    await waitFor(() => {
      expect(screen.getAllByTestId('map-marker').length).toBeGreaterThan(0);
    });
  });

  it('renders filter chips', async () => {
    render(<RestroomFinderScreen />);

    await waitFor(() => {
      expect(screen.getByText(/Accessible/)).toBeTruthy();
      expect(screen.getByText(/Single-stall/)).toBeTruthy();
    });
  });

  it('shows result count', async () => {
    render(<RestroomFinderScreen />);

    await waitFor(() => {
      expect(screen.getByText('1 found')).toBeTruthy();
    });
  });
});
