import { createContext, useContext, useState, useEffect } from 'react';
import { View, useColorScheme } from 'react-native';
import { storage } from '@/services/storage';
import { STORAGE_KEYS } from '@/constants/storage-keys';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  activeTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('system');

  const activeTheme = theme === 'system' ? (systemTheme ?? 'light') : theme;

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await storage.get(STORAGE_KEYS.REGULAR.THEME);
      if (saved) setThemeState(saved as Theme);
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      await storage.set(STORAGE_KEYS.REGULAR.THEME, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, activeTheme, setTheme }}>
      <View className={activeTheme === 'dark' ? 'dark' : ''} style={{ flex: 1 }}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
