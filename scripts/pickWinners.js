import cron from 'node-cron';
import Challenge from './models/challenge.js';
import Post from './models/post.js';
import User from './models/user.js';
import League from './models/league.js';

//not tested well

cron.schedule('0 0 * * *', async () => {
  const expiredChallenges = await Challenge.find({
    deadline: { $lt: new Date() },
    status: 'done',
  });

  for (const challenge of expiredChallenges) {
    const posts = await Post.find({
      challenge: challenge._id
    });

    const league = await League.findById(challenge.league);

    for (const post of posts) {
      const voteCounts = { 1: 0, 2: 0 };
      for (const vote of post.votes) {
        voteCounts[vote.winner]++;
      }
      if (voteCounts[1] > voteCounts[2]) {
        const user1 = await User.findById(post.user1);
        user1.wins += 1;
        await user1.save();
        league.updateRecord(user1, 'wins');//should be changed
      } else if (voteCounts[1] < voteCounts[2]) {
        const user2 = await User.findById(post.user2);
        user2.wins += 1;
        await user2.save();
        league.updateRecord(user2, 'wins');
      } else {
        const user1 = await User.findById(post.user1);
        const user2 = await User.findById(post.user2);
        user1.draws += 1;
        user2.draws += 1;
        await user1.save();
        await user2.save();
        league.updateRecord(user1, 'draws');
        league.updateRecord(user2, 'draws');
      }
    }

    await Challenge.updateOne(
      { _id: challenge._id },
      { $set: { status: 'done' } }
    );

    await league.save();
  }
});
