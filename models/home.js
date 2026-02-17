const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path-util');
const { error } = require('console');
const homeFilePath = path.join(rootDir, 'data', 'homes.json');

const registeredHomes = [];

module.exports = class Home{
    constructor(houseName, city, price, rating, imageURL, description){
        this.houseName = houseName;
        this.city = city;
        this.price = price;
        this.rating = rating;
        this.imageURL = imageURL;
        this.description = description;
    }
    save(callback) {
    Home.fetchAll(registeredHomes => {
      registeredHomes.push(this);

      fs.writeFile(homeFilePath, JSON.stringify(registeredHomes), callback);
    });
  }
    static fetchAll(callback){
        fs.readFile(homeFilePath, (error, data) => {
            let homes = [];
            if(error){
                callback([]);
            }else{
            callback(JSON.parse(data));
            }
        });

    }
}
