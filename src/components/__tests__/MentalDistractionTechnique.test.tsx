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

    // Number buttons should be present
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
    expect(screen.getByText('C')).toBeTruthy(); // Clear button
    expect(screen.getByText('Submit')).toBeTruthy();
  });

  it('calls onClose when back button pressed', () => {
    const onClose = jest.fn();
    render(<MentalDistractionTechnique onClose={onClose} />);

    fireEvent.press(screen.getByTestId('back-button'));

    expect(onClose).toHaveBeenCalled();
  });
});
