import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { BreathingTechnique } from '../BreathingTechnique';

describe('BreathingTechnique', () => {
  it('renders start button when inactive', () => {
    render(<BreathingTechnique hapticEnabled={true} />);
    expect(screen.getByText('Start')).toBeTruthy();
  });

  it('shows breathing phase when active', () => {
    render(<BreathingTechnique hapticEnabled={true} />);

    fireEvent.press(screen.getByText('Start'));

    expect(screen.getByText('Inhale')).toBeTruthy();
    expect(screen.getByText('Stop')).toBeTruthy();
  });

  it('calls onClose when close button pressed', () => {
    const onClose = jest.fn();
    render(<BreathingTechnique hapticEnabled={true} onClose={onClose} />);

    fireEvent.press(screen.getByTestId('close-button'));

    expect(onClose).toHaveBeenCalled();
  });
});
