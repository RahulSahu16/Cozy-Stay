const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path-util');
const homeFilePath = path.join(rootDir, 'data', 'homes.json');
const Favourite = require("./favourite");


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
      if (this.id) { // edit case
        registeredHomes = registeredHomes.map(home => home.id !== this.id ? home : this);
      } else { // new case
        this.id = Math.random().toString();
        registeredHomes.push(this);
      }
      fs.writeFile(homeFilePath, JSON.stringify(registeredHomes), callback);
    });
    }
    
    static fetchAll(callback){
        fs.readFile(homeFilePath, (error, data) => {
        if(error){
            callback([]);
        }else{
            callback(JSON.parse(data));
        }
       });
    }
   
    static findById(homeId, callback) {
            Home.fetchAll(homes => {
            const home = homes.find(home => home.id.toString() === homeId);
            callback(home);
        });
    }
    
    static deleteById(homeId, callback) {
        Home.fetchAll(homes => {
            const homeIndex = homes.filter(home => home.id.toString() !== homeId.toString());
             fs.writeFile(homeFilePath, JSON.stringify(homeIndex), error => {
                if(error){
                    return callback(error);
                }
                Favourite.deleteById(homeId, callback);
            });
        });
    }
}