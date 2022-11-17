const path = require('path');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.module\.s(a|c)ss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: true,
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        },
      ],
      include: path.resolve(__dirname, '../src'),
    });

    config.module.rules.push({
      test: /\.s(a|c)ss$/,
      exclude: /\.module\.s(a|c)ss$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        },
      ],
      include: path.resolve(__dirname, '../src'),
    });

    const fileloaderRule = config.module.rules.find(
      (rule) => rule.test && rule.test.test('.svg')
    );
    fileloaderRule.exclude = /\.svg$/;

    config.module.rules.push({
      test: /\.svg$/i,
      enforce: 'pre',
      issuer: /\.[jt]sx?$/,
      use: [{ loader: '@svgr/webpack', options: { icon: true } }],
      include: path.resolve(__dirname, '../src'),
    });

    config.resolve.plugin = [new TsConfigPathsPlugin()];

    return config;
  },
};
