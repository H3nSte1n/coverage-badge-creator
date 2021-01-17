#!/usr/bin/env node

import { Controller } from './Controller';
import { SetupValidation } from './validations/SetupValidation';

SetupValidation.loadConfig()
  .then(() => SetupValidation.scan())
  .then(() => Controller.run())
  .then(() => console.info('\n\nBadges successfully created'))
  .catch((error: string) => {
    console.error(`Error: ${error}`);
    console.info('Info: You may also find the documentation helpful');
  });
