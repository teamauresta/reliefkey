import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { MentalDistractionTechnique } from '../MentalDistractionTechnique';

describe('MentalDistractionTechnique', () => {
  it('renders a math problem', () => {
    render(<MentalDistractionTechnique onClose={() => {}} />);

    // Should show a question with numbers and operator
    expect(screen.getByTestId('math-question')).toBeTruthy();
  });

  it('shows number pad for input', () => {
    render(<MentalDistractionTechnique onClose={() => {}} />);

    // Number buttons 0-9 should be present
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
    expect(screen.getByText('0')).toBeTruthy();
  });

  it('calls onClose when close button pressed', () => {
    const onClose = jest.fn();
    render(<MentalDistractionTechnique onClose={onClose} />);

    fireEvent.press(screen.getByTestId('close-button'));

    expect(onClose).toHaveBeenCalled();
  });
});
