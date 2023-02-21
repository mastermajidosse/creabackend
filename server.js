import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/connectDb.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
const app = express();

app.use(
  cors({
    origin: '*',
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  bodyParser.json({
    limit: '4mb',
  })
);
dotenv.config();
connectDb();

app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/users', userRoutes);

const port = process.env.PORT || 5000;
app.listen(
  port,
  console.log(`Server is running on ${port} in ${process.env.NODE_ENV} mode...`)
);
