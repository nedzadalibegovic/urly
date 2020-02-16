const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const urlRoute = require('./routes/url');
const loginRoute = require('./routes/login');
const redirectRoute = require('./routes/redirect');
const tokenRoute = require('./routes/token');
const authentication = require('./routes/auth');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const { errorHandler, notFound } = require('./routes/error');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(process.env.MONGO);

const app = express();

// required middlewares
app.use(helmet());
app.use(morgan('common'));
app.use(cors());
app.use(express.json());

// front end
app.use('/login', loginRoute);
app.use(express.static('public/root'));

// api
app.use('/api', authentication);
app.use('/api', urlRoute.router);

// token refresh
app.use('/token', cookieParser());
app.use('/token', tokenRoute);

// redirection
app.use('/', redirectRoute);

// not found
app.use(notFound);

// error handler
app.use(errorHandler);

app.listen(process.env.PORT);