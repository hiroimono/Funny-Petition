const spicedPg 			= require('spiced-pg');
const bc				= require('./bc');

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbuser, dbpass } = require('../secret');
    // db = spicedPg(`postgres:postgres:postgres@localhost:5432/signers`);
    db = spicedPg(`postgres:${dbuser}:${dbpass}@localhost:5432/petition`); // more secure option to login
}

//////////////Signers Database//////////////
exports.getSigners = () => {
    return db.query(
        `SELECT * FROM signers`
    ).then(({rows}) => {
        return rows;
    });
};

exports.addSigner = (name, surname, email, signature, user_id) => {
    return db.query(
        `INSERT INTO signers (name, surname, email, signature, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id`, //$1, $2 ... very important
        [name, surname, email, signature, user_id]
    ).then(({rows}) => {
        return rows[0].id;
    });
};

exports.getSignature = (id) => {
    return db.query(
        `SELECT * FROM signers WHERE user_id = $1`,
        [id]
    ).then(({rows}) => {
        return rows[0];
    });
};

exports.deleteSignature = (id) => {
    return db.query(
        `DELETE FROM signers WHERE id = $1`,
        [id]
    );
};

//////////////Uselist Database//////////////
exports.registerUser = (name, surname, email, password) => {
    console.log("user's registration info");
    return db.query(
        `INSERT INTO userlist (name, surname, email, password) VALUES ($1, $2, $3, $4) RETURNING id`,
        [name, surname, email, password]
    ).then(({rows}) => {
        return rows[0].id;
    });

};

exports.getPassword = email => {
    return db
        .query(
            `SELECT password, id FROM userlist WHERE email=$1`,
            [email]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.checkUser = email => {
    return db.query(
        `SELECT * FROM userlist where email = $1`, [email]
    );
};

//////////////user_profiles database//////////////
exports.getUserProfileInfo = (id) => {
    return db
        .query(
            `SELECT userlist.name, userlist.surname, userlist.email, user_profiles.age, user_profiles.city, user_profiles.webpage FROM userlist
            JOIN user_profiles
            ON user_profiles.user_id = userlist.id
            WHERE userlist.id = $1`,
            [id]
        ).then( ({rows}) => {
            return rows;
        });
};

exports.addRegisterationInfoToUserProfile = (user_id) => {
    console.log("User_id were added to 'user_profiles' database.");
    return db.query(
        `INSERT INTO user_profiles (user_id) VALUES ($1) RETURNING id`,
        [user_id]
    ).then(({rows}) => {
        return rows[0].user_id;
    });
};

exports.updateUserProfileInfo = (id, name, surname, email, age, city, webpage) => {
    //update userlist database
    return db.query( `UPDATE userlist SET name = $1, surname = $2, email = $3 WHERE userlist.id = $4`, [name, surname, email, id] )
        .then(() =>
            //update user_profiles database
            db.query( `UPDATE user_profiles SET age = $1, city = $2, webpage = $3 WHERE user_profiles.user_id = $4`, [age, city, webpage, id] )
        )
        .then(() => {
            return db.query(`SELECT userlist.name, userlist.surname, userlist.email, user_profiles.age, user_profiles.city, user_profiles.webpage
				FROM userlist JOIN user_profiles
				ON user_profiles.user_id = userlist.id
				WHERE userlist.id = $1`, [id]
            );
        })
        .then( ({rows}) => {
            return rows;
        });
};


exports.getPasswordFromId = (id) => {
    return db.query( `SELECT * FROM userlist WHERE id = $1`, [id] )
        .then(({rows}) => {
            console.log('old password from database: ', rows[0].password);
            return rows[0].password;
        });
};

exports.changePassword = (id, new_password) => {
    return db.query( `UPDATE userlist SET password = $1 WHERE id = $2`, [new_password, id] )
        .then( ({rows}) => {
            console.log('hashed new password: ', rows[0]);
            return rows;
        });
};
