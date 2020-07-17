const mongoose = require('mongoose');
const User = require('../models/user');
const Domain = require('../models/domain');
const URL = require('../models/url');
const Token = require('../models/token');

const main = async () => {
    process.stdout.write('Connecting to database.......');
    await mongoose.connect(process.env.MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
    process.stdout.write('.....OK\n');

    process.stdout.write('Deleting all records.......');
    await Promise.all([User.deleteMany(), Domain.deleteMany(), URL.deleteMany(), Token.deleteMany()]);
    process.stdout.write('.......OK\n');

    process.stdout.write('Creating demo user.......');
    const { _id } = await User.create({
        username: 'demo',
        password: 'skafiskafnjak',
    });
    process.stdout.write('.........OK\n');

    process.stdout.write('Adding whitelisted domains.......');
    await Domain.create([
        {
            domain: 'github.com',
        },
        {
            domain: 'medium.com',
        },
    ]);
    process.stdout.write('.OK\n');

    process.stdout.write('Adding some urls.......');
    await URL.create([
        {
            title: "This project's repo",
            url: 'https://github.com/nedzadalibegovic/urly',
            userID: _id,
        },
        {
            title: 'My website',
            url: 'https://www.nedzadalibegovic.com/',
            userID: _id,
        },
    ]);
    process.stdout.write('...........OK\n');

    process.stdout.write('Disconnecting from database.......');
    await mongoose.disconnect();
    process.stdout.write('OK\n');
};

main();
