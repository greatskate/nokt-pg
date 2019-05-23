
const bcrypt = require('bcrypt');
const saltRounds = 10;
var ModelManager = require("./ModelManager");
var props = require("./PropsManager/props").PROPS;

/*
module.exports.update = async function(value){
  var object = {
    model: ModelManager.getModel(value.constructor.name),
    value: value
  }

  var listManyToMany = [];
  var command = "INSERT INTO "+ object.value.constructor.name +"s";
  var commandValue = " VALUES ("
  command +="(";

  for (var column in object.model){
    if(isDirectInsert(object,column)){
        command += column+",\n";
        commandValue += await setValue(object,column)+",\n";
    }
    else if(isManyToManyField(object,column)){
      listManyToMany.push(column);
    }
  }

  command = command.substring(0,command.length-2);
  commandValue = commandValue.substring(0,commandValue.length-2);
  commandValue += ");";
  command += ")"+commandValue;
  command += "SELECT currval('"+object.value.constructor.name+"s_id_seq');"
  object.value.id =1;
  console.log(command);
  let arrayOfCommandManyToMany = []
  for (var column in listManyToMany){
    let commandManyToManys = await insertManyToMany(object,listManyToMany[column]);
    console.log(commandManyToManys);
    arrayOfCommandManyToMany = arrayOfCommandManyToMany.concat(commandManyToManys);
  }

  async updateObject(object){
    var properties = Object.getOwnPropertyNames(object);
    var command = "UPDATE "+ object.constructor.name +"s SET \n"
    for (var i=0;i<properties.length;i++){
      if (typeof(object[properties[i]])=="object"){
          if (Array.isArray(object[properties[i]])){
            for (var j= 0; j< object[properties[i]].length;j++){
              await this.updateObject(object[properties[i]][j])
            }
          }
          else{
            if (object[properties[i]]!=null){
            command += properties[i]+ " = '"+object[properties[i]].id+"',\n";
         }
        }
      }
      else{
        command += properties[i]+ " = '"+object[properties[i]]+"',\n";
      }
    }
    command = command.substring(0,command.length-2);
    command += "\n WHERE id = "+object.id+";";

    this.executeCommand(command);
   }
   */
