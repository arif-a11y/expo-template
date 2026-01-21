import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const breakpoints = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
} as const;

export const screen = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isTablet: Platform.OS === 'ios' ? Platform.isPad : SCREEN_WIDTH >= breakpoints.tablet,
  isPhone: Platform.OS === 'ios' ? !Platform.isPad : SCREEN_WIDTH < breakpoints.tablet,
};
