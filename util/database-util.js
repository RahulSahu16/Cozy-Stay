const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const url = "mongodb+srv://MERN_User:cozystay1234@merncluster.vlen7zm.mongodb.net/CozyStay?retryWrites=true&w=majority&appName=MERNCluster";

let _db;
const mongoConnect = (callback) => {
MongoClient.connect(url)
.then((client) => {
    console.log(client);
    _db = client.db("cozystay");
    callback();
})
.catch(error => {
    console.log("Error connecting to MongoDB:", error);
});
}

const getDb = () => {
    if (!_db) {
        throw new Error("No database connected!");
    }
    return _db;
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
