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
            '@': './src',
            '@components': './src/components',
            '@features': './src/features',
            '@hooks': './src/hooks',
            '@services': './src/services',
            '@providers': './src/providers',
            '@constants': './src/constants',
            '@lib': './src/lib',
            '@types': './src/types',
            '@config': './src/config',
          },
        },
      ],
      'react-native-reanimated/plugin', // Must be last
    ],
  };
};
