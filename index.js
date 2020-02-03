const express = require('express');
const mongoose = require('mongoose');
const urlRoute = require('./routes/urls');
const validationRoute = require('./routes/validation');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(process.env.MONGO);

const app = express();

app.use(express.json());
app.use('/', validationRoute);
app.use('/', urlRoute)

app.listen(process.env.PORT);