import { TextStyle } from 'react-native';

export const typography = {
  hero: {
    fontSize: 40,
    fontWeight: '300',
    letterSpacing: -0.5,
  } as TextStyle,
  h1: {
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: 0,
  } as TextStyle,
  h2: {
    fontSize: 24,
    fontWeight: '500',
    letterSpacing: 0.2,
  } as TextStyle,
  h3: {
    fontSize: 20,
    fontWeight: '500',
  } as TextStyle,
  body: {
    fontSize: 16,
    fontWeight: '400',
  } as TextStyle,
  caption: {
    fontSize: 14,
    fontWeight: '400',
  } as TextStyle,
  small: {
    fontSize: 12,
    fontWeight: '400',
  } as TextStyle,
  button: {
    fontSize: 16,
    fontWeight: '600',
  } as TextStyle,
} as const;

export type Typography = typeof typography;
