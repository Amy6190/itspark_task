first for database name is itspark and remaining thing check .env file .
I have also add .env file in git , usually its not recommended but as its for demo so thats why i put .env file in git
initially create table with below query 
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    senderId INT REFERENCES users(id),
    receiverId INT REFERENCES users(id),
    message VARCHAR(255) NOT NULL,
    isRead BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

then follow process first signup , then sign in  , allow notification on , so that you will get real time notification also  