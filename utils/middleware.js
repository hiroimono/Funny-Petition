// const db			= require('../utils/db');
// const cookieParser		= require ('cookie-parser');
// const cookieSession		= require ('cookie-session');

exports.requireLogin =(req, res, next) => {
    if(!req.session.LOGIN){
        console.log('Middleware REDIRECT the page to "welcome" page.');
        console.log('req.session.LOGIN=false. First, user have to LOGIN.');
        return res.redirect('/welcome');
    }
    next();
};

exports.requireLogout =(req, res, next) => {
    if(req.session.LOGIN){
        console.log('Middleware REDIRECT the page to "Sign in" page.');
        console.log('req.session.LOGIN = true. User already registered and logged in', );
        return res.redirect('/signin');
    }
    next();
};

exports.requireSignature = (req, res, next) => {
    if(!req.session.signatureId){
        return res.redirect('/petitions');
    }
    next();
};

exports.requireNoSignature = (req, res, next) => {
    if(req.session.signatureId){
        return res.redirect('/petition/signed');
    }
    next();
};



// res.cookie('signatureID', 'This is SIGNATURE_ID (it will be changed according to its owner!)');
// console.log( `adding req.cookies.signatureID experimentally ==> `, res.cookie.signatureID);
//
// db.addSigner().then(
//     () => db.getSigners()
// ).then(function(id){
//     console.log(id);
//     return db.getSigners();
// }).then(function({rows}){
//     console.log(
//         rows
//     );
// });
