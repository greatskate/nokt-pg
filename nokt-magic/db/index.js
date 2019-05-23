var DatabaseObject = require("../../objects/DatabaseObject").DatabaseObject;
var ModelManager = require("../../managers/ModelManager");
var SelectManager = require("../../managers/SelectManager");
var DatabaseManager = require("../../managers/DatabaseManager");

class TestObject extends DatabaseObject{
  constructor(object){
      this.id = object.id;
      this.charfield = object.charField;
      this.number = object.number;
      this.foreignKey = object.foreignKey;
      this.manyToMany = object.manyToMany;
      this.passwordField = object.passwordField;
      this.emailField = object.emailField ;
      this.text = object.text ;
      this.booleanField = object.booleanField ;
  }
}
module.exports.Test = TestObject;
module.exports.TestModel = {
    get:function(value){
      return DatabaseManager.get(TestObject,value);
    }
}

class LinkTest extends DatabaseObject{
  constructor(object){
    super();
    this.id = object.id;
    this.charfield = object.charField;
  }
}

module.exports.LinkTest = LinkTest;
module.exports.LinkTestModel = {

  get:function(value){
    var model = ModelManager.getModel("LinkTest");
    return SelectManager.select(Test,model,value);
  }
}
