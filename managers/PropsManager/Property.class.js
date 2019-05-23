
var props = require("./props").PROPS;
module.exports.Property = class Property{
  constructor(type){
    this.type = type;

  }
  addDefaultValue(value){
    this.defaultValue = value;
  }
  addMaxLength(value){
    this.maxLength = value;
  }
  addForeignKey(value){
    this.foreignKey = value;
  }
  addManyToManyField(value){
    this.manyToManyField = value;
  }
  isManyToManyField(){
    return this.type===props.MANYTOMANYFIELD;
  }
  isForeignKey(){
    return this.type===props.FOREIGNKEY;
  }

}
