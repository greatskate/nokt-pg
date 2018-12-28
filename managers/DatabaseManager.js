
var DatabaseManager = class DatabaseManager{
  constructor(){
  }
  /**
  *
  *
  */
  async insertObject(object){
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
    var res = await this.executeCommand(command);
    object.id = res[1].rows[0].currval;
    for (var i = 0;i<listManyToMany.length;i++){
      listManyToMany[i] = listManyToMany[i].replace("-1",object.id);
      this.executeCommand(listManyToMany[i]);
    }
   }

   /**
   *
   *
   */
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

    /**
    *
    *
    */
  async createTable(object){
    var properties = Object.getOwnPropertyNames(object);
    var listManyToMany = [];
    var command = "CREATE TABLE "+ object.constructor.name +"s (\n";
    for (var i=0;i<properties.length;i++){
      if (Array.isArray(object[properties[i]])){
        listManyToMany.push(this.createManyToMany(object,properties[i]));
      }
      else{
        if (properties[i].valueOf() == "id".valueOf()){
          command += properties[i] +" SERIAL PRIMARY KEY,\n";
        }
        else{
          command += properties[i] +" "+ this.defineType(object[properties[i]])+",\n";
        }
      }

    }

    command = command.substring(0,command.length-2);
    command += ");";
    try{
      await this.executeCommand(command);
      for (var i = 0;i<listManyToMany.length;i++){
        this.executeCommand(listManyToMany[i]);
      }

        console.log(" - Table "+object.constructor.name+"s well created");
    }
    catch(error){
      console.log(" - Table "+object.constructor.name+"s not created: "+error.message);
    }

  }
      /**
      *
      *
      */
  defineType(propertie){
    if (typeof(propertie)=="number"){
      return "INTEGER"
     }
    else if (typeof(propertie)=="boolean"){
       return "BOOLEAN"
     }
    else if (typeof(propertie)=="string"){
      if (propertie == "password"){
        return "CHAR("+LENGTHCHAR*5+")";
      }
      if (propertie == "email"){
        return "CHAR("+LENGTHCHAR*3+")";
      }
      if (propertie == "text"){
        return "TEXT";
      }
      return "CHAR("+LENGTHCHAR+")";
    }
   else if (typeof(propertie)=="object"){
     return "INTEGER REFERENCES "+ propertie.constructor.name+"s(id)";
   }
  }
      /**
      *
      *
      */
  async loadObject(object){

    var properties = Object.getOwnPropertyNames(object);
    var command = "SELECT * FROM "+object.constructor.name+"s\n WHERE \n"
    var propertiesToFind = [];
    for (var i= 0; i<properties.length;i++){
      if (object[properties[i]] != null){
        if (typeof(object[properties[i]])=="object"){
            if (Array.isArray(object[properties[i]])){
              propertiesToFind.push({
                  propertie : properties[i],
                  type : object[properties[i]][0].constructor.name
                }
              );
            }
            else{
              command += " "+properties[i]+" = '"+object[properties[i]].id +"' AND"
          }
        }
        else{
          if(!(properties[i] =="id" && object[properties[i]] =="-1"))
            command += " "+properties[i]+" = '"+object[properties[i]] +"' AND";
        }
      }
    }
    command = command.substring(0,command.length-4);
    command += ";";
    const res = await this.executeCommand(command);
    var objectReturn = res.rows[0];
    for(var i = 0; i<propertiesToFind.length;i++){
      const resMany = await this.executeCommand("SELECT * FROM "+object.constructor.name+"s_"+propertiesToFind[i].type+"s WHERE "+
          "idList = "+objectReturn.id+";");
      objectReturn[propertiesToFind[i].propertie] = [];
      for (var j=0; j<resMany.rows.length;j++){
        var stat = new models.Stat(null,null,null);
        stat.id = resMany.rows[j].iditem;
        await objectReturn[propertiesToFind[i].propertie].push(await this.loadObject(stat));
      }
    }
    object = objectReturn;
    return object;
  }

  createManyToMany(object,propertie){
    var command = "CREATE TABLE "+ object.constructor.name +"s_"+propertie+" ("+
          "idList INTEGER REFERENCES "+ object.constructor.name+"s(id),\n"+
          "idItem INTEGER REFERENCES "+ object[propertie][0].constructor.name+"s(id)"+
          ");";
    return command;
  }
  insertManyToMany(object,propertie,index){
    var command = "INSERT INTO "+ object.constructor.name +"s_"+propertie+" VALUES\n("+
          ""+ object.id+",\n"+
          ""+ object[propertie][index].id+""+
          ");";
    return command;
  }
  async executeCommand(command){
         const client = new Client({
             user: process.env.POSTGRES_USER,
             host: process.env.DB_HOST,
             database: process.env.POSTGRES_DB,
             password: process.env.POSTGRES_PASSWORD,
             port: process.env.DB_PORT,
           });
         await client.connect();
         const res = await client.query(command);
         await client.end();
         return res;
  }

}

module.exports.DatabaseManager = DatabaseManager;
