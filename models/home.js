const { getDb } = require("../util/database-util");
const Favourite = require("./favourite");
const mongodb = require("mongodb");

module.exports = class Home{
    constructor(houseName, city, price, rating, imageURL, description, id = null){
        this.houseName = houseName;
        this.city = city;
        this.price = price;
        this.rating = rating;
        this.imageURL = imageURL;
        this.description = description;
        this._id = id;
    }

    save() {
        const db = getDb();

        // If _id exists, update the existing home; otherwise insert a new one
        if (this._id) {
            const collection = db.collection("homes");
            const updatedHome = {
                houseName: this.houseName,
                city: this.city,
                price: this.price,
                rating: this.rating,
                imageURL: this.imageURL,
                description: this.description
            };

            let objectId = null;
            try {
                objectId = new mongodb.ObjectId(String(this._id));
            } catch (e) {
                objectId = null;
            }

            if (objectId) {
                // Try updating by ObjectId first; if nothing is matched, fall back to string _id
                return collection
                    .updateOne({ _id: objectId }, { $set: updatedHome })
                    .then(result => {
                        if (result.matchedCount === 0) {
                            return collection.updateOne(
                                { _id: String(this._id) },
                                { $set: updatedHome }
                            );
                        }
                        return result;
                    });
            }

            // If _id is not a valid ObjectId, treat it as a plain string
            return collection.updateOne(
                { _id: String(this._id) },
                { $set: updatedHome }
            );
        }

        // Insert new home
        return db.collection("homes").insertOne(this);
    }

    static fetchAll(){
        const db = getDb();
        return db.collection("homes").find().toArray();
    }

    static findById(homeId){
        const db = getDb();
        const collection = db.collection("homes");

        // Try ObjectId lookup first (for documents created with MongoDB's default _id)
        let objectId = null;
        try {
            objectId = new mongodb.ObjectId(String(homeId));
        } catch (e) {
            objectId = null;
        }

        if (objectId) {
            return collection.findOne({ _id: objectId }).then(home => {
                if (home) {
                    return home;
                }
                // Fallback: handle cases where _id was stored as a plain string
                return collection.findOne({ _id: String(homeId) });
            });
        }

        // If homeId can't be converted to ObjectId, just treat it as a string _id
        return collection.findOne({ _id: String(homeId) });
    }

    static deleteById(homeId){
         const db = getDb();
         return db.collection("homes").deleteOne({ _id: new mongodb.ObjectId(homeId) });
    }

    update(){
        
    }
}






























































// const fs = require('fs');
// const path = require('path');
// const rootDir = require('../util/path-util');
// const homeFilePath = path.join(rootDir, 'data', 'homes.json');
// const Favourite = require("./favourite");



// const registeredHomes = [];

// module.exports = class Home{
//     constructor(houseName, city, price, rating, imageURL, description){
//         this.houseName = houseName;
//         this.city = city;
//         this.price = price;
//         this.rating = rating;
//         this.imageURL = imageURL;
//         this.description = description;
//     }
    
//     save(callback) {
//         Home.fetchAll(registeredHomes => {
//       if (this.id) { // edit case
//         registeredHomes = registeredHomes.map(home => home._id !== this.id ? home : this);
//       } else { // new case
//         this.id = Math.random().toString();
//         registeredHomes.push(this);
//       }
//       fs.writeFile(homeFilePath, JSON.stringify(registeredHomes), callback);
//     });
//     }
    
//     static fetchAll(callback){
//         fs.readFile(homeFilePath, (error, data) => {
//         if(error){
//             callback([]);
//         }else{
//             callback(JSON.parse(data));
//         }
//        });
//     }
   
//     static findById(homeId, callback) {
//             Home.fetchAll(homes => {
//             const home = homes.find(home => home._id.toString() === homeId);
//             callback(home);
//         });
//     }
    
//     static deleteById(homeId, callback) {
//         Home.fetchAll(homes => {
//             const homeIndex = homes.filter(home => home._id.toString() !== homeId.toString());
//              fs.writeFile(homeFilePath, JSON.stringify(homeIndex), error => {
//                 if(error){
//                     return callback(error);
//                 }
//                 Favourite.deleteById(homeId, callback);
//             });
//         });
//     }
// }



// const cozyStayDB = require("./util/database-util");
// cozyStayDB.execute("SELECT * FROM homes").then(([rows]) => {
//     console.log(rows);
// });