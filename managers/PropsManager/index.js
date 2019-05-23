var Property = require("./Property.class").Property;
var props = require("./props").PROPS;

var MAX_LENGTH = 20;
var MAX_LENGTH_PASSWORD = 100;
var MAX_LENGTH_EMAIL = 60;

module.exports.CharField = function(obj){
  let prop = new Property(props.CHARFIELD);
  prop = evalProps(prop,obj);
  return prop;
}

module.exports.Number = function(obj){
  let prop = new Property(props.NUMBER);
  prop = evalProps(prop,obj);
  return prop;
}

module.exports.ForeignKey = function(model,obj){
  let prop = new Property(props.FOREIGNKEY);
  prop.addForeignKey(model);
  prop = evalProps(prop,obj);
  return prop;
}
module.exports.ManyToManyField = function(model,obj){
  let prop = new Property(props.MANYTOMANYFIELD);
  prop.addManyToManyField(model);
  prop = evalProps(prop,obj);
  return prop;
}

module.exports.PasswordField = function(obj){
  let prop = new Property(props.PASSWORDFIELD);
  prop = evalProps(prop,obj);
  return prop;
}

module.exports.EmailField = function(obj){
  let prop = new Property(props.EMAILFIELD);
  prop = evalProps(prop,obj);
  return prop;
}

module.exports.Text = function(obj){
  let prop = new Property(props.TEXT);
  prop = evalProps(prop,obj);
  return prop;
}

module.exports.BooleanField = function(obj){
  let prop = new Property(props.BOOLEANFIELD);
  prop = evalProps(prop,obj);
  return prop;
}


module.exports.Identifier = function(obj){
  let prop = new Property(props.IDENTIFIER);
  return prop;
}

function evalProps(prop,obj){
  if(obj!== undefined){
    if (obj.defaultValue !== undefined){
      prop.addDefaultValue(obj.defaultValue);
    }
    if (obj.maxLength !== undefined){
        prop.addMaxLength(obj.maxLength);
    }
  }
  else{
    if(prop.type===props.CHARFIELD){
          prop.addMaxLength(MAX_LENGTH);
    }
    else if(prop.type===props.PASSWORDFIELD){
          prop.addMaxLength(MAX_LENGTH_PASSWORD);
    }
    else if(prop.type===props.EMAILFIELD){
          prop.addMaxLength(MAX_LENGTH_EMAIL);
    }
  }
  return prop;
}
