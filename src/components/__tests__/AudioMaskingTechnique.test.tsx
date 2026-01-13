import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { AudioMaskingTechnique } from '../AudioMaskingTechnique';

describe('AudioMaskingTechnique', () => {
  it('renders sound selection buttons', () => {
    render(<AudioMaskingTechnique onClose={() => {}} />);

    expect(screen.getByText('White Noise')).toBeTruthy();
    expect(screen.getByText('Rain')).toBeTruthy();
    expect(screen.getByText('Running Water')).toBeTruthy();
  });

  it('shows playing state when sound is selected', async () => {
    render(<AudioMaskingTechnique onClose={() => {}} />);

    fireEvent.press(screen.getByText('White Noise'));

    await waitFor(() => {
      expect(screen.getByText('Stop')).toBeTruthy();
    });
  });

  it('calls onClose when close button pressed', () => {
    const onClose = jest.fn();
    render(<AudioMaskingTechnique onClose={onClose} />);

    fireEvent.press(screen.getByTestId('close-button'));

    expect(onClose).toHaveBeenCalled();
  });
});
