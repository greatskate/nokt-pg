const Models = require("../../test/createModels");
const Objects = require("../db");


module.exports.Link = [
  {
    name:"Test",
    object: Objects.Test,
    model: Models.Test
  },
  {
    name:"LinkTest",
    object: Objects.LinkTest,
    model: Models.LinkTest
  }

]
