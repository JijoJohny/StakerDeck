const User = require('../models/User');

exports.stake = async (req, res) => {
    const userId = req.user._id;

    try {

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }


        const stakeAmount = user.balance * 0.5;
        if (stakeAmount <= 0) {
            return res.status(400).json({ error: 'Insufficient balance to stake' });
        }

        const { duration } = req.body; // Expected to be 15, 30, 45, or 90
        const validDurations = [15, 30, 45, 90];
        if (!validDurations.includes(duration)) {
            return res.status(400).json({ error: 'Invalid staking duration' });
        }


        const rewardMultiplier = {
            15: 0.02,
            30: 0.05,
            45: 0.08,
            90: 0.12
        };
        const stakingReward = stakeAmount * rewardMultiplier[duration];

        user.stakedAmount += stakeAmount;
        user.stakingDuration = duration;
        user.stakingReward += stakingReward;
        user.stakingStartDate = new Date();

        await user.save();

        res.status(200).json({ message: 'Staking successful', stakedAmount: stakeAmount, stakingReward });

    } catch (error) {
        console.error("Error in staking:", error.message);
        res.status(500).json({ error: "Staking failed" });
    }
};

exports.claimRewards = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const currentDate = new Date();
        const stakingDurationInMilliseconds = user.stakingDuration * 24 * 60 * 60 * 1000;
        const stakingEndDate = new Date(user.stakingStartDate.getTime() + stakingDurationInMilliseconds);

        if (currentDate >= stakingEndDate) {
            const rewards = user.stakedAmount * 0.01 * user.stakingDuration;
            user.stakingReward += rewards;
            user.stakedAmount = 0;

            await user.save();

            res.status(200).json({ message: "Rewards calculated", rewards });
        } else {
            res.status(200).json({ message: "Staking still in progress", remainingDays: Math.ceil((stakingEndDate - currentDate) / (1000 * 60 * 60 * 24)) });
        }
    } catch (error) {
        console.error("Error in calculating rewards:", error.message);
        res.status(500).json({ error: "Reward calculation failed" });
    }
};
