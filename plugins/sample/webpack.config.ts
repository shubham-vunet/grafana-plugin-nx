import { Configuration, container } from 'webpack';
import { customizeArray, customizeObject, mergeWithCustomize } from 'webpack-merge';

import camelCase from 'lodash/camelCase';
import grafanaConfig from '../../.config/webpack/webpack.config';

const pluginPackageDeets = require('./package.json');

const deps = pluginPackageDeets.dependencies;
const pluginName = pluginPackageDeets.name;

const sharedDeps = {
  ...deps,
  '@emotion/css': { singleton: true, requiredVersion: deps['@emotion/css'] },
  '@emotion/react': { singleton: true, requiredVersion: deps['@emotion/react'] },
  react: { singleton: true, requiredVersion: deps.react },
  'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
  '@grafana/data': { singleton: true, requiredVersion: false },
  '@grafana/e2e-selectors': { singleton: true, requiredVersion: false },
  '@grafana/runtime': { singleton: true, requiredVersion: false },
  '@grafana/schema': { singleton: true, requiredVersion: false },
  '@grafana/ui': { singleton: true, requiredVersion: false },
};

const config = (env) =>
  mergeWithCustomize({
    customizeArray: customizeArray({
      plugins: 'prepend',
      externals: 'replace',
    }),
    customizeObject: customizeObject({
      entry: 'replace',
    }),
  })(grafanaConfig(env), {
    entry: {
      plugin: './plugin.ts',
      'redis-cli-panel/plugin': './redis-cli-panel/plugin.ts',
      'redis-cpu-panel/plugin': './redis-cpu-panel/plugin.ts',
      'redis-gears-panel/plugin': './redis-gears-panel/plugin.ts',
      'redis-keys-panel/plugin': './redis-keys-panel/plugin.ts',
      'redis-latency-panel/plugin': './redis-latency-panel/plugin.ts',
    },
    devtool: 'source-map',
    externals: [],
    output: {
      libraryTarget: '',
      publicPath: `/public/plugins/${pluginName}/`,
      uniqueName: pluginName,
    },
    plugins: [
      new container.ModuleFederationPlugin({
        name: camelCase(pluginName),
        filename: 'module.js',
        remotes: {},
        exposes: {
          './plugin': './plugin.ts',
        },
        shared: sharedDeps,
      }),
      new container.ModuleFederationPlugin({
        name: camelCase('redis-cli-panel'),
        filename: './redis-cli-panel/module.js',
        remotes: {},
        exposes: {
          './plugin': './redis-cli-panel/plugin.ts',
        },
        shared: sharedDeps,
      }),
      new container.ModuleFederationPlugin({
        name: camelCase('redis-cpu-panel'),
        filename: './redis-cpu-panel/module.js',
        remotes: {},
        exposes: {
          './plugin': './redis-cpu-panel/plugin.ts',
        },
        shared: sharedDeps,
      }),
      new container.ModuleFederationPlugin({
        name: camelCase('redis-gears-panel'),
        filename: './redis-gears-panel/module.js',
        remotes: {},
        exposes: {
          './plugin': './redis-gears-panel/plugin.ts',
        },
        shared: sharedDeps,
      }),
      new container.ModuleFederationPlugin({
        name: camelCase('redis-keys-panel'),
        filename: './redis-keys-panel/module.js',
        remotes: {},
        exposes: {
          './plugin': './redis-keys-panel/plugin.ts',
        },
        shared: sharedDeps,
      }),
      new container.ModuleFederationPlugin({
        name: camelCase('redis-latency-panel'),
        filename: './redis-latency-panel/module.js',
        remotes: {},
        exposes: {
          './plugin': './redis-latency-panel/plugin.ts',
        },
        shared: sharedDeps,
      }),
    ],
    optimization: {
      moduleIds: 'named',
      chunkIds: 'named',
      minimize: false,
    },
    resolve: {
      fallback: {
        stream: false,
        tty: false,
        util: false,
        indexof: false,
        fs: false,
      },
    },
  } as Configuration);

export default config;
