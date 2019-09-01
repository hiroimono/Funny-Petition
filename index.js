const express 			= require ('express');
const exphbs 			= require ('express-handlebars');
const bodyParser 		= require ('body-parser');
const path 				= require ('path');
const cookieParser		= require ('cookie-parser');
const cookieSession		= require ('cookie-session');
const csurf 			= require ('csurf');

const app 				= express();

app.use(cookieSession({
    secret: 'hiroimono',
    maxAge: 1000 * 60 * 60 * 24
}));

// Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(csurf());

app.use(function(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    res.setHeader("x-frame-options", "allow-from: 127.0.0.1:8080/public/Kitty/index.html");
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

//route for index page
app.use('/', require('./routes/routing'));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Port ${PORT} is listening...`));
// //for test purpose
// if (require.main === module) {
//     app.listen(8080, () => console.log(`Port 8080 is listening for TEST...`));
// }


// //demo routes for test
// app.get('/test', (req, res) => {
//     if (req.session.fakeCookieForDemo) {
//         res.send('<p> wow you have a cookie </p>');
//     } else{
//         res.redirect('/testresult');
//     }
// });
//
// app.post('/test', (req, res) => {
//     res.session.wentToWelcome = 'hell yea';
//     res.redirect('/testresult');
// });
//
// app.get('/testresult', (req, res) => {
//     res.send('<p>You are in testresult page');
// });
