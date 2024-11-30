import express from 'express';

const app = express();

app.get('/server-info', async (_req, res) => {
  res.send('OK');
});

app.listen(5555, () => {
  console.log(`Server is running`);
});
