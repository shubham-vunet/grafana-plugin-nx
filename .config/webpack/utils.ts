import { SOURCE_DIR } from './constants';
import { existsSync } from 'fs';
import { resolve } from 'path';

export function getPackageJson() {
  return require(resolve(process.cwd(), 'package.json'));
}

export function getPluginId() {
  const { id } = require(resolve(process.cwd(), `plugins/sample/src/plugin.json`)); // TODO

  return id;
}

export function hasReadme() {
  return existsSync(resolve(process.cwd(), SOURCE_DIR, 'README.md'));
}
