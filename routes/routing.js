const express 					= require('express');
const db						= require('../utils/db');
const { hash, compare }			= require('../utils/bc');
const {
    requireSignature,
    requireNoSignature,
    requireLogin,
    requireLogout
} 								= require('../utils/middleware.js');
const router 					= express.Router();


/*******START ROUTING WITH WELCOME*********/
router.get('/', (req, res) => {
    console.log('/*******START ROUTING WITH WELCOME**********/');
    res.redirect( '/welcome' );
});

router.get('/welcome', (req, res) => {
    if(req.session.LOGIN){
        res.render('welcome', {
            layout: 'main2'
        });
    } else {
        res.render('welcome');
    }
});

/**************REGISTRATION****************/
router.get('/registration', requireLogout, (req, res) => {
    console.log('/**************REGISTRATION*****************/');
    res.render('registration'); //temporary
});

router.post('/registration', requireNoSignature, (req, res) => {
    console.log('req.session.LOGIN: ', req.session.LOGIN);
    let { name, surname, email, pass, passagain } = req.body;
    console.log(req.body);

    let errors = [];
    // Validation of Fields
    if(!name) 					errors.push({ text: 'Please add a name' });
    if(!surname) 				errors.push({ text: 'Please add a surname' });
    if(!email) 					errors.push({ text: 'Please add a email' });
    if(!pass || !passagain ) 	errors.push({ text: 'Please fill the password area again' });
    if(pass != passagain ) 		errors.push({ text: 'Passwords are not same!' });
    // Check for errors
    if(errors.length > 0) {
        res.render('registration', {
            errors: errors
        });
    } else {
        hash(pass)
            .then( hash => {
                console.log("hashed password is: ", hash);
                db.registerUser(
                    name,
                    surname,
                    email,
                    hash
                )
                    .then((id) =>
                        db.addRegisterationInfoToUserProfile(id)
                    )
                    .then((id) => {
                        console.log("Assigned id for new user: ", id);
                        req.session.userID = id;
                        res.render('registration-thanks', {
                            name,
                            surname,
                        });
                    })
                    .catch(err => {
                        if(err.detail.startsWith('Key (email)=(') && err.detail.endsWith(' already exists.')){
                            console.log('Same email error.');
                            let errors = [];
                            errors.push({ text: 'There is an account with this email. Please use Sign in button to login.' });
                            res.render('registration', {
                                errors: errors,
                            });
                        } else {
                            console.log('POST request error: ', err);
                            res.render('registration', {
                                errors: err,
                            });
                        }
                    });
            });
    }
});

/*****************SIGN IN******************/

router.get('/signin', (req, res) => {
    console.log('/*****************SIGN IN*******************/');
    if(req.session.LOGIN){
        res.render('signin', {
            layout: 'main2'
        });
    } else {
        res.render('signin');
    }
});

router.post('/signin', (req, res) => {
    let { email, password } = req.body;
    db.getPassword( email )
        .then(result => {
            compare(password, result[0].password)
                .then(match => {
                    if(match){
                        req.session.userID = result[0].id;
                        console.log('req.session userID: ', req.session.userID);
                        req.session.LOGIN= true;
                        db.getSignature(result[0].id)
                            .then((rows) => {
                                req.session.signatureID = rows.id;
                                console.log('req.session signatureID: ', req.session.signatureID);
                                console.log('User now login. req.session.LOGIN: ', req.session.LOGIN);
                                res.render('signed-thanks', {
                                    layout:'main2',
                                    name: rows.name,
                                    surname: rows.surname,
                                    signature: rows.signature
                                });
                            })
                            .catch(err => {
                                console.log('req.session userID: ', req.session.userID);
                                console.log('req.session signatureID: ', req.session.signatureID);
                                console.log('req.session.LOGIN: ', req.session.LOGIN);
                                console.log('User did not yet signed the petition: ', err);
                                res.redirect('/petition/1');
                            });
                    } else {
                        res.render('signin', {
                            errors: 'Sign in failed! Please try again.'
                        });
                    }
                })
                .catch( err => {
                    console.log('Login page error: ', err);
                    res.render('signin', {
                        errors: 'Sign in failed! Please try again.'
                    });
                });
        })
        .catch( err => {
            console.log('Login page error: ', err);
            res.render('signin', {
                layout: 'main',
                errors: 'Login failed! Please try again.'
            });
        });
});

/*****************PETITIONS*****************/

router.get('/petitions', (req, res) => {
    console.log('/*****************PETITIONS*****************/');
    console.log('req.session userID: ', req.session.userID);
    console.log('req.session signatureID: ', req.session.signatureID);
    console.log('req.session.LOGIN: ', req.session.LOGIN);
    if(req.session.LOGIN){
        res.render('petitions',  {
            layout:'main2'
        });
    } else {
        res.render('petitions',  {
            layout:'main'
        });
    }
});


router.get('/petition/:petition_id', requireLogin, (req, res) => {
    console.log(`/*****************PETITION/${req.params.petition_id}*****************/`);
    console.log('req.session userID: ', req.session.userID);
    console.log('req.session signatureID: ', req.session.signatureID);
    console.log('req.session.LOGIN: ', req.session.LOGIN);
    res.render(`petition_${req.params.petition_id}`, {
        layout:'main2'
    });
});

router.post('/petition/:petition_id', requireNoSignature, (req, res) => {
    let { name, surname, email, signature } = req.body;
    console.log(req.body);

    let errors = [];

    // Validation of Fields
    if(!name) 			errors.push({ text: 'Please add a name' });
    if(!surname) 		errors.push({ text: 'Please add a surname' });
    if(!email) 			errors.push({ text: 'Please add a email' });
    if(!signature) 		errors.push({ text: 'Please sign the signature area' });

    // Check for errors
    if(errors.length > 0) {
        res.render(`petition_${req.params.petition_id}`, {
            layout: 'main2',
            errors: errors
        });
    } else {
        console.log(`page req.session.userID: `, req.session.userID );
        console.log(`req.session.signatureID: `, req.session.userID );
        console.log(`req.session.LOGIN: `, req.session.LOGIN );
        console.log(`req.session.csrfSecret: `, req.session.csrfSecret );
        db.addSigner(
            name,
            surname,
            email,
            signature,
            req.session.userID
        )
            .then(id => {
                req.session.signatureID = id;
                console.log(`req.session in '${req.params.petition_id}' after signatureID added => `, req.session );
                db.getSigners()
                    .then( (rows) => {
                        res.render('signed-thanks', {
                            layout : 'main2',
                            name: name,
                            surname: surname,
                            signature: signature,
                            rows : rows
                        });
                    });
            })
            .catch(err => {
                console.log('POST request error: ', err);
                res.render('petition_1', {
                    layout: 'main2',
                    err: err
                });
            });
    }
});


/***************EDIT*******************/
router.get('/edit',  requireLogin, (req, res) => {
    console.log('/********************EDIT*******************/');
    console.log('req.session signatureID: ', req.session.signatureID);
    console.log('req.session.LOGIN: ', req.session.LOGIN);
    var id = req.session.userID;
    console.log('req.session userID: ', req.session.userID);
    db.getUserProfileInfo(id)
        .then( result => {
            console.log('User profile info: ', result );
            res.render('edit', {
                layout: 'main2',
                name: result[0].name,
                surname: result[0].surname,
                email: result[0].email,
                age: result[0].age,
                city: result[0].city,
                webpage: result[0].webpage,
            });
        })
        .catch(err => console.log('ERROR when getting user profile info in edit page: ', err));
});

router.post('/edit', (req, res) => {
    let { name, surname, email, age, city, webpage } = req.body;
    if (age == '') age = null;
    db.updateUserProfileInfo(
        req.session.userID,
        name,
        surname,
        email,
        age,
        city,
        webpage
    ).then ( (rows) => {
        console.log('Profile is updated successfully!');
        res.render('profile-update-thanks', {
            layout: 'main2',
            name: rows[0].name,
            surname: rows[0].surname
        });
    }
    ).catch( err => {
        console.log('Profile Update process is NOT succesful!', err);
        res.render('profile-update-thanks', {
            layout: 'main2',
            errors: err
        });
    });
});

/*************CHANGE PASSWORD*************/
router.get('/change-password', (req, res) => {
    console.log('/*************CHANGE PASSWORD*************/');
    console.log('req.session signatureID: ', req.session.signatureID);
    console.log('req.session userID: ', req.session.userID);
    res.render('change-password', {
        layout: 'main2'
    });
});

router.post('/change-password', (req, res) => {
    console.log('req.session.LOGIN: ', req.session.LOGIN);
    console.log('req.session userID: ', req.session.userID);
    var id = req.session.userID;
    let errors = [];
    let { old_password, new_password, new_password_repeat } = req.body;
    console.log(old_password, new_password, new_password_repeat);

    // Validation of Fields
    if( !old_password || !new_password || !new_password_repeat ) 	errors.push({ text: 'Please fill the password area again' });
    if( new_password != new_password_repeat ) 						errors.push({ text: 'Passwords are not same!' });

    // Check for errors
    if(errors.length > 0) {
        res.render(`change-password`, {
            layout: 'main2',
            errors: errors
        });
    } else {

        Promise.all([
            hash(old_password),
            hash(new_password)
        ])
            .then((passwords) => {
                console.log('hashed old password: ', passwords[0]);
                console.log('hashed new password: ', passwords[1]);

                db.getPasswordFromId(id)
                    .then((oldPassInDB) => {
                        console.log(oldPassInDB);
                        compare(old_password, oldPassInDB)
                            .then(match => {
                                if(match){
                                    db.changePassword(id, passwords[1])
                                        .then(() => {
                                            console.log('Password is updated successfully!');
                                            res.render('profile-update-thanks', {
                                                layout: 'main2',
                                            });
                                        })
                                        .catch(err => console.log('Password do not changed! Error: ', err));
                                } else console.log('password did not changed.');
                            }
                            )
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));
            })
            .catch(() => {});
    }
});

/**********ADD A NEW PETITION*************/
router.get('/add', requireLogin, (req, res) => {
    console.log('/************ADD A NEW PETITION*************/');
    console.log('req.session userID: ', req.session.userID);
    console.log('req.session signatureID: ', req.session.signatureID);
    console.log('req.session.LOGIN: ', req.session.LOGIN);
    res.render('add',  {
        layout:'main2'
    });
});

router.post('/add', (req, res) => {
    res.render('add',  {
        layout:'main2'
    });
});

/***************SIGNOUT*******************/
router.get('/sign-out', requireLogin, (req, res) => {
    console.log('/******************SIGNOUT******************/');
    console.log('req.session signatureID: ', req.session.signatureID);
    req.session.LOGIN = false;
    req.session.userID = false;
    console.log('req.session.LOGIN : ', req.session.LOGIN);
    console.log('req.session.userID : ', req.session.userID);
    res.render('signout-thanks');
});

module.exports = router;
