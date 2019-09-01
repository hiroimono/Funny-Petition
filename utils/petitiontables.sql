DROP TABLE IF EXISTS userlist;

CREATE TABLE userlist (
	id SERIAL primary key,
    name VARCHAR(255) not null CHECK (name != ''),
	surname VARCHAR(255) not null CHECK (surname != ''),
	email VARCHAR(255) not null CHECK (email != '') UNIQUE,
	password VARCHAR(255) not null CHECK (password != ''),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS user_profiles CASCADE;
CREATE TABLE user_profiles(
    id SERIAL PRIMARY KEY,
    age INTEGER,
    city VARCHAR(50),
    webpage VARCHAR,
    user_id INTEGER REFERENCES userlist(id) NOT NULL UNIQUE
);

DROP TABLE IF EXISTS signers;
CREATE TABLE signers (
    id SERIAL primary key,
    name VARCHAR(255) not null CHECK (name != ''),
	surname VARCHAR(255) not null CHECK (surname != ''),
	email VARCHAR(255) not null CHECK (email != '') UNIQUE,
    signature TEXT not null CHECK (signature != ''),
	user_id INTEGER REFERENCES userlist(id) NOT NULL UNIQUE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
