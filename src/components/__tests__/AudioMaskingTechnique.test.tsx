import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { AudioMaskingTechnique } from '../AudioMaskingTechnique';

describe('AudioMaskingTechnique', () => {
  it('renders sound selection buttons', () => {
    render(<AudioMaskingTechnique onClose={() => {}} />);

    expect(screen.getByText('White Noise')).toBeTruthy();
    expect(screen.getByText('Ocean Waves')).toBeTruthy();
    expect(screen.getByText('Thunderstorm')).toBeTruthy();
    expect(screen.getByText('European Forest')).toBeTruthy();
    expect(screen.getByText('Forest Birds')).toBeTruthy();
    expect(screen.getByText('Night Forest')).toBeTruthy();
    expect(screen.getByText('Summer Night')).toBeTruthy();
    expect(screen.getByText('Wind Blowing')).toBeTruthy();
    expect(screen.getByText('Wind Hum')).toBeTruthy();
  });

  it('shows playing state when sound is selected', async () => {
    render(<AudioMaskingTechnique onClose={() => {}} />);

    fireEvent.press(screen.getByText('White Noise'));

    await waitFor(() => {
      expect(screen.getByText('Stop Sound')).toBeTruthy();
    });
  });

  it('calls onClose when back button pressed', () => {
    const onClose = jest.fn();
    render(<AudioMaskingTechnique onClose={onClose} />);

    fireEvent.press(screen.getByTestId('back-button'));

    expect(onClose).toHaveBeenCalled();
  });
});
