import { useState, useEffect } from 'react';
import { Dimensions, Platform, ScaledSize } from 'react-native';
import { breakpoints } from '@/lib/responsive';

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
