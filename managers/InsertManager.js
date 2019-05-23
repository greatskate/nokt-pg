const bcrypt = require('bcrypt');
const saltRounds = 10;
var ModelManager = require("./ModelManager");
var props = require("./PropsManager/props").PROPS;


module.exports.insert = async function(value){
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


  /*
  var properties = Object.getOwnPropertyNames(object);
  var listManyToMany = [];
  var command = "INSERT INTO "+ object.constructor.name +"s";
  command +="("
  for (var i=0;i<properties.length;i++){
        if (Array.isArray(object[properties[i]])){
        }
        else{
          if (properties[i].valueOf() != "id".valueOf()){
            command += properties[i]+",\n";
          }
    }
  }
  command = command.substring(0,command.length-2);
  command += ") VALUES\n("
  for (var i=0;i<properties.length;i++){
    if (typeof(object[properties[i]])=="object"){
        if (Array.isArray(object[properties[i]])){
          for (var j= 0; j< object[properties[i]].length;j++){
            //await this.insertObject(object[properties[i]][j]);
            listManyToMany.push(this.insertManyToMany(object,properties[i],j));
          }
        }
        else{
          command += object[properties[i]].id+",\n";
        }
    }
    else{
      if (properties[i].valueOf() != "id".valueOf()){
        command += "'"+object[properties[i]]+"',\n";
      }
    }
  }

  command = command.substring(0,command.length-2);
  command += ");";
  command += "SELECT currval('"+object.constructor.name+"s_id_seq');"
  console.log(command);
  */
}

function isDirectInsert(object,column){
  if(object.value[column]===undefined){
    return false;
  }
  if(object.model[column].type === props.MANYTOMANYFIELD){
    return false;
  }
  return true;
}

function insertManyToMany(object,column){
  let linkTo = new object.model[column].manyToManyField()
  let commands = [];
  for (var index in object.value[column]){
    var command = "INSERT INTO "+ object.value.constructor.name.toLowerCase()+"_"+linkTo.constructor.name.toLowerCase()+"s(obj_1,obj_2) VALUES("+
          ""+ object.value.id+","+
          ""+ object.value[column][index].id+""+
          ");";
    commands.push(command)
    }
  return commands;
}

function isManyToManyField(object,column){
  if (object.value[column]!== undefined){
    return object.model[column].type===props.MANYTOMANYFIELD;
  }
  return false;
}

async function setValue(object,column){
  switch(object.model[column].type){
    case props.PASSWORDFIELD:
      return "'"+ await bcrypt.hashSync(object.value[column], saltRounds) +"'"
      break;
    case props.CHARFIELD:
    case props.EMAILFIELD:
    case props.TEXT:
      return "'"+object.value[column]+"'";
      break;
    case props.BOOLEANFIELD:
    case props.NUMBER:
    case props.IDENTIFIER:
      return object.value[column];
      break;
    case props.FOREIGNKEY:
      return object.value[column].id;
      break;
    }
}
