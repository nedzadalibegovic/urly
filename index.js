const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const urlRoute = require('./routes/urls');
const validationRoute = require('./routes/validation');
const loginRoute = require('./routes/login');
const redirectRoute = require('./routes/redirect');
const { authentication, tokenRoute } = require('./routes/auth');
const cookieParser = require('cookie-parser');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(process.env.MONGO);

const app = express();

// required middlewares
app.use(cors());
app.use(express.json());

// front end
app.use('/login', loginRoute);
app.use(express.static('public'));

// api
app.use('/api', authentication);
app.use('/api', validationRoute);
app.use('/api', urlRoute);

// token refresh
app.use('/token', cookieParser());
app.use('/token', tokenRoute);

// redirection
app.use('/', redirectRoute);

app.listen(process.env.PORT);