var PropsManager = require("../managers/PropsManager");
var DatabaseObject = require("../objects/DatabaseObject").DatabaseObject;
module.exports.Test = class Test extends DatabaseObject{
  constructor(){
    super();
    this.charfield = PropsManager.CharField({defaultValue:"charField",maxLength:30});
    this.number = PropsManager.Number();
    this.foreignKey = PropsManager.ForeignKey(LinkTest);
    this.manyToMany = PropsManager.ManyToManyField(LinkTest);
    this.passwordField = PropsManager.PasswordField();
    this.emailField = PropsManager.EmailField();
    this.text = PropsManager.Text();
    this.booleanField = PropsManager.BooleanField();
  }
}


class LinkTest extends DatabaseObject{
    constructor(){
      super();
      this.charfield = PropsManager.CharField({defaultValue:"charField",maxLength:30});
    }
}

module.exports.LinkTest = LinkTest;
