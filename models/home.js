const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path-util');
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
        this.id = Math.random().toString(); // Generate a unique ID for the home      
        Home.fetchAll(registeredHomes => {
        registeredHomes.push(this);
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
}


// Flow 

// Step 1: Purana data lao
// Step 2: Naya home add karo
// Step 3: File me save karo