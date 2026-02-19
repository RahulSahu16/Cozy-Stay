const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path-util');

const favouriteFilePath = path.join(rootDir, 'data', 'favourite.json');

module.exports = class Favourite {

    // Get all favourite IDs
    static fetchAll(callback) {
        fs.readFile(favouriteFilePath, (error, data) => {
            if (error) {
                callback([]);
            } else {
                callback(JSON.parse(data));
            }
        });
    }

    // Add a home to favourites
    static addToFavourite(homeId, callback) {
        Favourite.fetchAll((favouriteIds) => {

            // prevent duplicate
            if (!favouriteIds.includes(homeId)) {
                favouriteIds.push(homeId);
            }

            fs.writeFile(
                favouriteFilePath,
                JSON.stringify(favouriteIds),
                callback
            );
        });
    }
}
