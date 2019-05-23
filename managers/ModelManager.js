var Singleton = (function () {
    var instance;

    function createInstance(models) {
        var object = new ModelManager(models);
        return object;
    }

    return {
        getInstance: function () {
            return instance;
        },
        createInstance: function (models) {
            if (!instance) {
                instance = createInstance(models);
            }
            return instance;
        }
    };
})();

class ModelManager{
  constructor(models){
    this.models  = models;
    }
  }

module.exports.init = function(models){
  console.log("test");
  Singleton.createInstance(models);
}

module.exports.getModel = function(modelName){
  return Singleton.getInstance().models[modelName];
}
