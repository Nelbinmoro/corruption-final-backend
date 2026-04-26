const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB");

        const users = await User.find({});
        console.log(`Found ${users.length} users:`);
        users.forEach(u => console.log(`- ${u.email} (Role: ${u.role})`));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUsers();
