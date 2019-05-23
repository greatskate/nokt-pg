var CreateManager = require("./managers/CreateManager");
var models = require("./tests/createModels");
var ModelManager = require("./managers/ModelManager");
ModelManager.init(models);
var {
  Test,
  TestModel,
  LinkTest,
  LinkTestModel
} = require("./nokt-magic/db");



function createTableTest(){
  commands = CreateManager.create(models);
  console.log(commands);
}

function insertObjectTest(){
  let linkTest = new LinkTest({
    id:2,
    charField:"Link Test"
  })
  linkTest.save();
  let test = new Test({
      number:2,
      foreignKey: linkTest,
      manyToMany:[linkTest],
      passwordField:"password",
      emailField:"email",
      text:"text",
      booleanField:true,
    });
    test.save();
}
insertObjectTest();



function selectObjectTest(){
  let linkTest = new LinkTest({
    id:2,
    charField:"Link Test"
  })
  test = TestModel.get({
      id:1,
      number:2,
      foreignKey: linkTest,
      passwordField:"password",
      emailField:"email",
      text:"text",
      booleanField:true,});
  /*
  test === new Test({id:1});

  test = TestModel.all();
  test === [...]
  test = TestModel.filter({id:1});
  test === [...]
  */
}
selectObjectTest()
/*

function updateObjectTest(){
  test = TestModel.get({id:1});
  test.number = 8;
  test.save();
  test.manyToManyField.push(new LinkTest({charField:"Link Test"}));
  test.save();
}
*/
