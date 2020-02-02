const express = require('express');
const mongoose = require('mongoose');
const urlRoute = require('./routes/urls');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(process.env.MONGO);

const app = express();

app.use(express.json());
app.use('/api/v1/', urlRoute);

app.listen(process.env.PORT);