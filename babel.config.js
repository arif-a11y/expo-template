module.exports = function (api) {
  api.cache(true);
  return {
      presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': '.',
            '@components': './components',
            '@features': './features',
            '@hooks': './hooks',
            '@services': './services',
            '@providers': './providers',
            '@constants': './constants',
            '@lib': './lib',
            '@types': './types',
            '@config': './config',
            '@assets': './assets',
          },
        },
      ],
      'react-native-reanimated/plugin', // Must be last
    ],
  };
};
