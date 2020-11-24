const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const hotelRouter = require('./routers/hotelRouters')
const userRouter = require('./routers/userRouters')
const authenticationControllers = require('./controllers/authenticationControllers')
const globalErrorHandler = require('./controllers/errorControllers');

//MIDDLEWARE
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
dotenv.config({path: path.join(__dirname, 'config.env')});

//ROUTERS
app.get('/', (req,res) => {
    res.send('Hello world!');
})
app.post('/api/login', authenticationControllers.login);
app.post('/api/register', authenticationControllers.register);
app.use('/api/hotels', hotelRouter);
app.use('/api/users', userRouter);

dotenv.config({path: path.join(__dirname, 'config.env')});

app.all('*', (req, res, next) => {
    next(new appError(404, 'invalid URL'));
});
app.use(globalErrorHandler);

//LISTEN ON PORT
app.listen(3000, () => {
    console.log(`connect to port 3000`);
})