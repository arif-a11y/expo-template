import { useState, useEffect } from 'react';
import { Dimensions, Platform, ScaledSize } from 'react-native';
import { breakpoints } from '@/lib/responsive';

/**
 * Hook for responsive design that updates on dimension changes
 * @returns Object containing width, height, isPhone, isTablet
 */
export function useResponsive() {
  const [dimensions, setDimensions] = useState<ScaledSize>(
    Dimensions.get('window')
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const isTablet =
    Platform.OS === 'ios'
      ? Platform.isPad
      : dimensions.width >= breakpoints.tablet;

  return {
    width: dimensions.width,
    height: dimensions.height,
    isPhone: !isTablet,
    isTablet,
  };
}
