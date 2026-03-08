import { fileURLToPath } from 'url';
import express from 'express';
const app = express();

try {
  app.options('*', (req, res) => res.send('ok'));
  console.log('* works');
} catch (e) { console.error('star failed:', e.message); }

try {
  app.options('/*', (req, res) => res.send('ok'));
  console.log('/* works');
} catch (e) { console.error('slash star failed:', e.message); }

try {
  app.options('/(.*)', (req, res) => res.send('ok'));
  console.log('/(.*) works');
} catch (e) { console.error('/(.*) failed:', e.message); }

try {
  app.options('*', (req, res) => res.send('ok')); // Just testing if we can do something else
} catch (e) {}

console.log('done testing routes');
