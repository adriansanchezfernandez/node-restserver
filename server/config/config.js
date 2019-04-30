process.env.PORT = process.env.PORT || 3002;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;
if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb: //localhost:27017/cafe'
} else {

    urlDB = 'mongodb + srv: //adri2106:adri2106@cluster0-o1d21.mongodb.net/test'

}
process.env.URLDB = urlDB