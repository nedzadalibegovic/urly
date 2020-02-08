const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const urlRoute = require('./routes/urls');
const validationRoute = require('./routes/validation');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(process.env.MONGO);

const app = express();

app.use(cors());
app.use(express.static('public'))
app.use(express.json());
app.use('/api/', validationRoute);
app.use('/api/', urlRoute)

app.listen(process.env.PORT);