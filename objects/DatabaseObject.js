
var InsertManager = require("../managers/InsertManager");
var PropsManager = require("../managers/PropsManager");

var props = require("../managers/PropsManager/props").PROPS;

var DatabaseObject = class DatabaseObject{

  constructor(){
    this.id = PropsManager.Identifier();
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
    if (this.id === undefined){
      await InsertManager.insert(this);
    }
    else{
      /*
      await databaseManager.updateObject(this);
      */
    }
  }

  async createObject(object){
    for (value in object){
      this[value] = object[value];
    }
  }

  async hasForeignKey(){
    for(var prop in this){
      if (this[prop].type === props.FOREIGNKEY){
        return true;
      }
    }
    return false;
  }
  async hasManyToMany(){
    for(var prop in this){
      if (this[prop].type === props.MANYTOMANYFIELD){
        return true;
      }
    }
    return false;
  }
  async getManyToManyFields(){
    let manyToManyFields = [];
    for(var prop in this){
      if (this[prop].type === props.MANYTOMANYFIELD){
        manyToManyFields.push(prop);
      }
    }
    return manyToManyFields;
  }
  async getForeignKeys(){
    let foreignKeys = [];
    for(var prop in this){
      if (this[prop].type === props.FOREIGNKEY){
        foreignKeys.push({prop:prop,model:this[prop].foreignKey});
      }
    }
    return foreignKeys;
  }
}


module.exports.DatabaseObject = DatabaseObject;
