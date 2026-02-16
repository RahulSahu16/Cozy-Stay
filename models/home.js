const registeredHomes = [];

module.exports = class Home{
    constructor(houseName){
        this.houseName = houseName;
    }
    save(){
        registeredHomes.push(this);
    }
}