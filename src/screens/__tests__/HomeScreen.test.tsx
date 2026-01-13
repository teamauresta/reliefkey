import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { HomeScreen } from '../HomeScreen';

describe('HomeScreen', () => {
  it('renders all technique buttons', async () => {
    render(<HomeScreen />);

    // Wait for async state updates to settle
    await waitFor(() => {
      // Use getAllByText since technique names appear multiple times (quick-start + list)
      expect(screen.getAllByText('Guided Breathing').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Audio Masking').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Mental Distraction').length).toBeGreaterThan(0);
    });
  });

  it('shows quick-start button for default technique', async () => {
    render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('quick-start-button')).toBeTruthy();
    });
  });

  it('opens technique when button pressed', async () => {
    render(<HomeScreen />);

    await waitFor(() => {
      // Get all elements with the text, then press the last one (in the techniques list)
      const buttons = screen.getAllByText('Guided Breathing');
      fireEvent.press(buttons[buttons.length - 1]);
    });

    // Should show the breathing technique screen with Start button
    await waitFor(() => {
      expect(screen.getByText('Start')).toBeTruthy();
    });

    // Press start to begin breathing exercise
    fireEvent.press(screen.getByText('Start'));

    // Now should show the Inhale phase
    await waitFor(() => {
      expect(screen.getByText('Inhale')).toBeTruthy();
    });
  });
});
