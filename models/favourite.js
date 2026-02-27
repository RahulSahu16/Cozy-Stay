const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path-util');



const favouriteFilePath = path.join(rootDir, 'data', 'favourite.json');

module.exports = class Favourite {
  
  constructor(homeId) {
    this.homeId = homeId;
  }

  save(){
    const db = getDb();
    return db.collection("favourites").findOne({ homeId: this.homeId })
      .then(existingFav => {
        if (!existingFav) {
          return db.collection("favourites").insertOne(this);
      } else {
        return Promise.resolve();
      }
    });
  }

  static find(callback) {
      const db = getDb();
      return db.collection("favourites").find().toArray()
    }
    static deleteById(homeId) {
      const db = getDb();
      return db.collection("favourites").deleteOne({ homeId });
    }     
  }
