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
const db = require('./models/dbInteraction')
var fs = require('fs');
var handlebars = require('handlebars');

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




const sendNotificationJob = schedule.scheduleJob('* * * * *', async function () {
  const date = (Math.trunc(new Date().getTime() / 1000) * 1000)
  const plus1Minute = date + 60000
  const response = await db.getdataforSendNotification(date, plus1Minute)

  let hash = {};
  const arrForEmail = response.filter(function (current) {
    let exists = !hash[current.id];
    hash[current.id] = true;
    return exists;
  });

  let readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
      if (err) {
        callback(err);
      }
      else {
        callback(null, html);
      }
    });
  };
  arrForEmail.forEach(element => {
    readHTMLFile(__dirname + '/views/notificationTemplete.html', async function (err, html) {
      if (err) {
        console.log('error reading file', err);
        return;
      }
      var template = handlebars.compile(html);
      var replacements = {
        title: element.title,
        intialHour: new Date(element.intialHour).toLocaleString('es-AR'),
        finishHour: new Date(element.finishHour).toLocaleString('es-AR'),
        description: element.description,
      };
      var htmlToSend = template(replacements);
      var mailOptions = {
        from: 'mindfulmindsuport@gmail.com',
        to: element.email,
        subject: `Tienes un recordario`,
        html: htmlToSend
      };
      if (process.env.NODE_ENV !== 'test') {
        transporter.sendMail(mailOptions, function (error, response) {
          console.log(response.messageId)
          if (error) {
            console.log(error);
          }
        });
      }
    });
  });

  const arrForNotification = []
  response.forEach(element => {
    if (element.NotificationToken !== 'NoCreado') {
      let obj = {
        "title": element.title,
        "Body": `Recurda que a las ${new Date(element.intialHour).getHours() < 10 ? '0' : ''}${new Date(element.intialHour).getHours()}:${new Date(element.intialHour).getMinutes() < 10 ? '0' : ''}${new Date(element.intialHour).getMinutes()} tiene ${element.title}`,
        "pushToken": element.NotificationToken,
        "data": {
          "withSome": "data"
        }
      }
      arrForNotification.push(obj)
    }
  });
  const httpQuery = await axios.post('http://localhost:3500/SendNotification', arrForNotification)
})






var port = (process.env.PORT || '3000');


const server = app.listen(port, () => {
  console.log(`server run on port ${port}`)
})


module.exports = { app, server, restartRoutineJob, sendNotificationJob };
