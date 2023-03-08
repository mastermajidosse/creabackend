import cron from 'node-cron';
import Challenge from '../models/Challenge.js';
import Post from '../models/Post.js';
import League from '../models/League.js';

export const cronJob = cron.schedule('* * * * *', async () => {
  console.log('Running script every minute');
  const expiredChallenges = await Challenge.find({
    deadline: { $lt: new Date() },
    status: 'done',
  });

  console.log(expiredChallenges)

  for (const challenge of expiredChallenges) {
    const posts = await Post.find({
      challenge: challenge._id,
      status: 'done',
    });
    console.log(posts)

    for (const post of posts) {
      const votes = post.votes;
      console.log(votes)
      let countUser1 = 0;
      let countUser2 = 0;

      for (const vote of votes) {
        if (vote.winner === 1) {
          countUser1++;
        } else {
          countUser2++;
        }
      }

      let winner, loser;
      if (countUser1 > countUser2) {
        winner = post.creator1;
        loser = post.creator2;
      } else if (countUser2 > countUser1) {
        winner = post.creator2;
        loser = post.creator1;
      } else {
        winner = null;
        loser = null;
      }

      if (winner) {
        await League.findOneAndUpdate(
          { creators: winner },
          { $inc: { 'creators.$.wins': 1 } }
        );

        await League.findOneAndUpdate(
          { creators: loser },
          { $inc: { 'creators.$.losses': 1 } }
        );
      } else {
        await League.findOneAndUpdate(
          { creators: post.creator1 },
          { $inc: { 'creators.$.draws': 1 } }
        );

        await League.findOneAndUpdate(
          { creators: post.creator2 },
          { $inc: { 'creators.$.draws': 1 } }
        );
      }
    }

    await Challenge.updateOne(
      { _id: challenge._id },
      { $set: { status: 'expired' } }
    );
  }
});
