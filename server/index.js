const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const urlRoute = require('./routes/url');
const loginRoute = require('./routes/login');
const redirectRoute = require('./routes/redirect');
const tokenRoute = require('./routes/token');
const authentication = require('./routes/auth');
const registerRoute = require('./routes/register');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const { errorHandler, notFound } = require('./routes/error');
const filterRoute = require('./routes/filter');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(process.env.MONGO);

const app = express();

// for running behind nginx proxy
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 'uniquelocal');

// required middlewares
app.use(helmet());
app.use(morgan('common'));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// registration and login
app.use('/login', loginRoute);
app.use('/register', registerRoute);

// api
app.use('/api', authentication);
if (process.env.FILTER === '1') app.use('/api', filterRoute);
app.use('/api', urlRoute);

// token refresh
app.use('/token', tokenRoute);

// redirection
app.use('/', redirectRoute);

// not found
app.use(notFound);

// error handler
app.use(errorHandler);

app.listen(process.env.PORT);
