import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
  console.log('Setting up tests...');

  try {
    await rm(join(__dirname, '..', 'db.sqlite'));
  } catch (err) {}
});
