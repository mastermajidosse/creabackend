import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/connectDb.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import postRoutes from './routes/postRoutes.js';
import leagueRoutes from './routes/LeagueRoutes.js';
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
app.use('/api/posts', postRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/leagues', leagueRoutes);

const port = process.env.PORT || 5000;
app.listen(
  port,
  console.log(`Server is running on ${port} in ${process.env.NODE_ENV} mode...`)
);
