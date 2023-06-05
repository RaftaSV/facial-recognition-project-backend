import express from 'express';
import cors from 'cors';
import getConfig from 'config';
import { initializeDB } from './db';

const { port } = getConfig();

const app = express();

// creating Server
const initializeServer = async (routes) => {
  // initialize DB
  await initializeDB();
  app.use(cors());
  // json parse
  app.use(express.json());
  // url encoded data parse
  app.use(express.urlencoded({ extended: true }));

  // set urls
  app.use(routes);

  // create express app
  app.listen(port, () => {
    console.log(`app listening on http://localhost:${port}`);
  });
};

export default initializeServer;
