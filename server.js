const express = require('express');
const { sequelize } = require('./models');
const { rootRouter } = require('./routers');
const cookieParser = require('cookie-parser');

const port = 4000;
const app = express();
const cors = require('cors');
require('dotenv').config();
app.use(express.json());
const corsOptions = {
  origin: process.env.NOVE_ENV === 'dev' ? true : 'https://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

app.use(cookieParser());
app.use('/api/v1', rootRouter);

app.listen(port, async () => {
  console.log(`App listening on http://localhost:${port}`);
  try {
    await sequelize.authenticate();
    console.log('Kết nối thành công!.');
  } catch (error) {
    console.error('Kết nối thất bại:', error);
  }
});
