// const yaml = require('js-yaml')
// const fs = require('fs');
class connections {
  #db_uris;
  #dbs;
  #knex_dbs;
  // #config_file;
  constructor(){
    this.#db_uris = {};
    this.#dbs = {};
    this.#knex_dbs = {};
    // this.#config_file = './configs/db.yaml'
    try {
      this.#create_options();
      this.#create_dbs();
    } catch (e) {
      console.log(e);
    }

  }
  #create_options(){

    //Creating PG URI for connection
    try {
      //Loading Database YAML Config File
      // let fileContents = fs.readFileSync(this.#config_file, 'utf8');
      // let _conf = yaml.load(fileContents)[process.env.NODE_ENV];
      let conf = {
        postgres: {
          default: {
            application_name: process.env.APP_NAME,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_DATABASE,
            account_username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD
          },
          blockchain: {
            application_name: process.env.APP_NAME,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.BC_DB_DATABASE,
            account_username: process.env.BC_DB_USERNAME,
            password: process.env.BC_DB_PASSWORD
          }
        }  
      };
      //YAML File Loaded as a JSON Object

      //Reading Databases from conf:json; postgres, mongo, etc;
      for(var key in conf){
        if (!(key in this.#db_uris)){
          this.#db_uris[key] = {};
        }
        //Reading User Params of Databases; postgres://default@, mongo://default@, etc;
        for(var _key in conf[key]){
          if (!(_key in this.#db_uris)){
            let params = conf[key][_key];
            this.#db_uris[key][_key] = {
              pgp: `postgres://${params.account_username}:${params.password}@${params.host}:${params.port}/${params.database}?application_name=${params.application_name}`,
              knex: `postgresql://${params.account_username}:${params.password}@${params.host}:${params.port}/${params.database}?application_name=${params.application_name}`
            };
          }
        }
      }
      //Conf:JSON converted to string uris;


    } catch (e) {
      console.log(e);
    }

  }
  #create_dbs(){

    //Loading Database from uris
    for(var key in this.#db_uris){
      if(!(key in this.#dbs)){
        this.#dbs[key] = {};
      }
      if(!(key in this.#knex_dbs)){
        this.#knex_dbs[key] = {};
      }
      //Postgres Configuration
      if(key == 'postgres'){
        var pgp = require('pg-promise')();
        var knex = require('knex');
        //Each URI turns to db connection in #dbs as uris path;
        for (var _key in this.#db_uris[key]){
          //pg-promise connections
          if (!(_key in this.#dbs[key])){
            this.#dbs[key][_key] = pgp(this.#db_uris[key][_key].pgp);
          }
          //knex connections
          if(!(_key in this.#knex_dbs[key])){
            this.#knex_dbs[key][_key] =knex({
              client: 'pg',
              connection: this.#db_uris[key][_key].knex
            });
          }
        }
      }
    }
  }
  pgp_connection(conn_name='default', db_engine='postgres'){
    try{
      if (!(db_engine in this.#dbs)){
        console.log(`\t[-] db_engine ${db_engine} not found!`);
        console.log('\t[+] db_engine Changed to default value: "postgres".');
        db_engine = 'postgres';
      }
      if (!(conn_name in this.#dbs[db_engine])){
        console.log(`\t[-] conn_name ${db_engine} => ${conn_name} not found!`);
        console.log(`\t[+] conn_name Changed to default value: "default".`);
        conn_name = 'default';
      }
      return this.#dbs[db_engine][conn_name];
    }catch(e){
      console.log(e);
      return false;
    }
  }
  knex_connection(conn_name='default', db_engine='postgres'){
    try{
      if (!(db_engine in this.#knex_dbs)){
        console.log(`\t[-] db_engine ${db_engine} not found!`);
        console.log('\t[+] db_engine Changed to default value: "postgres".');
        db_engine = 'postgres';
      }
      if (!(conn_name in this.#knex_dbs[db_engine])){
        console.log(`\t[-] conn_name ${db_engine} => ${conn_name} not found!`);
        console.log(`\t[+] conn_name Changed to default value: "default".`);
        conn_name = 'default';
      }
      return this.#knex_dbs[db_engine][conn_name];
    }catch(e){
      console.log(e);
      return false;
    }
  }
}
module.exports = new connections();
