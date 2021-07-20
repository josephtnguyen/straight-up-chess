require('dotenv/config');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const ClientError = require('./client-error');
const pg = require('pg');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

app.use(express.json());

app.use(staticMiddleware);

app.use(errorMiddleware);

app.get('/api/get-posts', (req, res, next) => {
  const sql = `
  select *
    from "postedGames"
  `;

  db.query(sql)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.post('/api/create-post', (req, res, next) => {
  const { playerName, message, playerSide } = req.body;
  if (!playerName || !message || !playerSide) {
    throw new ClientError(400, 'missing required field');
  }

  const sql = `
  insert into "postedGames" ("playerName", "message", "playerSide")
  values ($1, $2, $3)
  returning *
  `;
  const params = [playerName, message, playerSide];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
