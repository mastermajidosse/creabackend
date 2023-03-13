import cron from 'node-cron';
import Challenge from '../models/Challenge.js';
import Post from '../models/Post.js';
import League from '../models/League.js';
import User from '../models/User.js';

export const cronJob = cron.schedule('* * * * *', async () => {
  console.log('Running script every minute');
  const expiredChallenges = await Challenge.find({
    deadline: { $lt: new Date() },
    status: 'pending',
  });
  console.log(expiredChallenges);

  for (const challenge of expiredChallenges) {
    const posts = await Post.find({
      challenge: challenge._id,
      status: 'done',
    });
    console.log(posts);

    for (const post of posts) {
      const [creator1, creator2] = await Promise.all([
        await User.findById(post.creator1),
        await User.findById(post.creator2),
      ]);
      const votes = post.votes;
      let countUser1 = 0;
      let countUser2 = 0;

      for (const vote of votes) {
        if (vote.winner === 1) {
          countUser1++;
        } else {
          countUser2++;
        }
      }
      console.log(countUser1);
      console.log(countUser2);
      if (countUser1 > countUser2) {
        post.winner = post.creator1;
        post.loser = post.creator2;
        creator1.wins++;
        creator2.loses++;
      } else if (countUser2 > countUser1) {
        post.winner = post.creator2;
        post.loser = post.creator1;
        creator2.wins++;
        creator1.loses++;
      } else {
        post.winner = null;
        post.loser = null;
        post.isDraw = true;
        creator1.draws++;
        creator2.draws++;
      }

      const [savedPost, savedCreator1, savedCreator2] = await Promise.all([
        post.save(),
        creator1.save(),
        creator2.save(),
      ]);
    }

    await Challenge.updateOne(
      { _id: challenge._id },
      { $set: { status: 'done' } }
    );
  }
});
