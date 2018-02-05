let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let cors = require('cors');
let fs = require('fs');


let index = require('./routes/index');
let notice = require('./routes/notice');
let timeline = require('./routes/timeline');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/*', cors());
app.use('/', index);
app.use('/notice', notice);
app.use('/timeline', timeline);
app.get('/img/:img',function (req, res) {
    let imgs = req.params.img;
    let img = fs.readFileSync(path.join(__dirname+'/public/images/'+imgs));
    res.writeHead(200, {'Content-Type': 'image/png' });
    res.end(img, 'binary');
});
app.post('/imgload/:no', function(req, res, next) {
    upload(req, res).then(function (file) {
        res.json(file);
    }, function (err) {
        res.sendStatus(500, err);
    });
});
let upload = function (req, res) {
    let deferred = Q.defer();
    let imagePath = path.join(__dirname+'/public/images');
    // let imagePath = '/public/images';
    let storage = multer.diskStorage({
        // 서버에 저장할 폴더
        destination: function (req, file, cb) {
            cb(null, imagePath);
        },

        // 서버에 저장할 파일 명
        filename: function (req, file, cb) {
            file.uploadedFile = {
                name: Date.now(),
                ext: file.mimetype.split('/')[1]
            };
            cb(null, file.uploadedFile.name + '.' + file.uploadedFile.ext);
        }
    });

    let upload = multer({ storage: storage }).single('file');
    upload(req, res, function (err) {
        console.log(req.file)
        if (err) deferred.reject();
        else deferred.resolve(req.file.uploadedFile);
    });
    return deferred.promise;
};
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
