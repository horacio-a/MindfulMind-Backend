var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');



require('dotenv').config()

var indexRouter = require('./routes/index');
var registerConfirmation = require('./routes/registerConfimation')
var Login = require('./routes/Login')
var CRUDCalendar = require('./routes/CRUDCalendar')
var CRUDText = require('./routes/CRUDText')
var CRUDRoutine = require('./routes/CRUDRoutine')
var getData = require('./routes/getData')
var ForgetPassword = require('./routes/ForgetPassword')
var UserSetting = require('./routes/UserSetting')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', cors(), indexRouter);
app.use('/user', cors(), registerConfirmation)
app.use('/login', cors(), Login)
app.use('/Calendar', cors(), CRUDCalendar)
app.use('/Text', cors(), CRUDText)
app.use('/Routine', cors(), CRUDRoutine)
app.use('/getData', cors(), getData)
app.use('/ForgetPassword', cors(), ForgetPassword)
app.use('/UserSetting', cors(), UserSetting)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


var axios = require('axios');
const schedule = require('node-schedule');
const transporter = require('./nodeMailer/mailerconfig')


const restartRoutineJob = schedule.scheduleJob('0 0 * * *', async function () {
  const response = await axios.get('http://localhost:3500/restartRoutine')
  if (response.data.request === false) {
    var mailOptions = {
      from: 'mindfulmindsuport@gmail.com',
      to: process.env.MyEmail,
      subject: "Error en el restartRoutine",
      html: htmlToSend
    };
    transporter.sendMail(mailOptions, function (error, response) {
      console.log(response.messageId)
      if (error) {
        console.log(error);
      }
    });
  }
})

var port = (process.env.PORT || '3000');


const server = app.listen(port, () => {
  console.log(`server run on port ${port}`)
})


module.exports = { app, server, restartRoutineJob };
