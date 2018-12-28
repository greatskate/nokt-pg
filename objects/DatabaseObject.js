
var DatabaseManager = require("../managers/DatabaseManager");

var DatabaseObject = class DatabaseObject{

  constructor(){
    this.id = -1;
  }
  getId(){
    return this.id;
  }
  /*
    Method to save object in database
    if the object exists it updates it
    if not it inserts it

  */
  async save(){
    var databaseManager = new DatabaseManager.DatabaseManager();
    if (this.id == -1){
      await databaseManager.insertObject(this);
    }
    else{
      await databaseManager.updateObject(this);
    }
  }
}


module.exports.DatabaseObject = DatabaseObject;
