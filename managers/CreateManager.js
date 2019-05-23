
var props = require("./PropsManager/props").PROPS;

module.exports.create = function(models){
  console.log("-- Database creation begins --");
  let commands = []
  for (var model in models){
    let object =new models[model]();
    let command="CREATE TABLE "+object.constructor.name.toLowerCase()+"s(";
    let propertiesMany = [];
    for(var column in object){
      if (object[column].type === props.MANYTOMANYFIELD){
        propertiesMany.push({obj:object,prop:object[column]})
      }
      else{
        command+=propertyToSQL(column,object[column])+ ",";
      }
    }
    command = command.substring(0,command.length-1);
    command +=");"
    for(var prop in propertiesMany){
      command += createManyToMany(propertiesMany[prop])
    }
    commands.push(command);
  }
  console.log("-- Database creation ends --");
  return commands;
}


function propertyToSQL(column,property){
  let sql = "";
  switch(property.type){
    case props.IDENTIFIER:
      sql = column+" SERIAL PRIMARY KEY";
      break;
    case props.CHARFIELD:

      sql = column+" VARCHAR("+property.maxLength+")";
      sql += addDefaultValue(property);
      break;
    case props.NUMBER:

      sql = column+" INTEGER";
      sql += addDefaultValue(property);
      break;
    case props.FOREIGNKEY:
      sql = column+" INTEGER REFERENCES "+new property.foreignKey().constructor.name.toLowerCase()+"s(id)";
      sql += addDefaultValue(property);
      break;
    case props.MANYTOMANYFIELD:

      break;
    case props.PASSWORDFIELD:
      sql = column+" VARCHAR("+property.maxLength+")";
      break;
    case props.EMAILFIELD:
      sql = column+" VARCHAR("+property.maxLength+")";
      break;
    case props.TEXT:
      sql = column+" TEXT";
      sql += addDefaultValue(property);

      break;
    case props.BOOLEANFIELD:
      sql = column+" BOOLEAN";
      sql += addDefaultValue(property);
      break;
  }
  return sql
}

function addDefaultValue(property){
  if (property.defaultValue !== undefined){
    return " DEFAULT '"+property.defaultValue+"'"
  }
  return "";
}

function createManyToMany(prop){
  let command = "CREATE TABLE "+prop.obj.constructor.name.toLowerCase()+"_"+new prop.prop.manyToManyField().constructor.name.toLowerCase()+"s("+
  "obj_1 INTEGER REFERENCES "+prop.obj.constructor.name.toLowerCase()+"s(id),"+
  "obj_2 INTEGER REFERENCES "+new prop.prop.manyToManyField().constructor.name.toLowerCase()+"s(id) );";
  return command;
}
