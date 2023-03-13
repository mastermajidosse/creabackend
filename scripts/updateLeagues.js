import cron from 'node-cron';
import Challenge from '../models/Challenge.js';
import Post from '../models/Post.js';
import League from '../models/League.js';
import User from '../models/User.js';

export const updateLeagues = cron.schedule('* * * * *', async () => {
    
});
