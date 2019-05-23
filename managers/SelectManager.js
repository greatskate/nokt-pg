
const bcrypt = require('bcrypt');
const saltRounds = 10;
var ModelManager = require("./ModelManager");
var props = require("./PropsManager/props").PROPS;


module.exports.select = async function(model,value){
  var object = {
    model: model,
    value: value
  }

  let manyToManyFields = await object.model.getManyToManyFields();
  let hasManyToMany = manyToManyFields.length !== 0 ;

  let command="SELECT "
  command +="* from "+ object.model.constructor.name.toLowerCase()+"s WHERE "
  command += getConditions(object,value);
  command += ";"
  if(hasManyToMany){

  }
  console.log(command);


}

function getConditions(object,value){
  let conds = "";
  for (var val in value){
    if (object.model[val].isForeignKey()){
      conds += val+" = '"+value[val].id+"' AND ";
    }
    else if(object.model[val].isManyToManyField()){
      throw Error("Search by ManyToManyField is not implemented");
    }
    else{
        conds += val+" = '"+value[val]+"' AND ";
    }
  }
  conds = conds.substring(0,conds.length-4);
  return conds;
}

/*
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
*/
