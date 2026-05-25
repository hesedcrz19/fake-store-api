import { createRequire } from 'node:module';

export const readJSON = (importURL, path) => {
  const require = createRequire(importURL);
  return require(path);
};
