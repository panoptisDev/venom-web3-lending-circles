const libs = require.main.require('./libs');

const db_engine = 'postgres';
const conn_name = 'default';
let result = {
  message:null,
  done:false,
  data:null,
  code:200
}

try{
  var conn = libs.connections.knex_connection(conn_name, db_engine);
}catch(e){
  result.message = [e];
}

async function insert_table(table_name, insert_values){
  try{
    insert_values.created_at = new Date().toISOString().slice(0, 24);
    insert_values.updated_at = insert_values.created_at;
    let insertTable = await conn(table_name).returning('*').insert(insert_values);
    result.done = true;
    if(insertTable.length === 0){
      result.data = null;
    }else{
      result.data = insertTable[0];
    }
  }catch(e){
    if(typeof e.code != 'undefined' && e.code == '23505'){
      if(e.constraint.includes('account_username')) result.code = 405.1;
      else if(e.constraint.includes('email')) result.code = 405.6;
      else {
        console.log(e);
        result.code = 500.1;
      }
    }else{
      console.log(e);
      result.code = 500.1;
    }
    result.done = false;
    result.data = null;
    result.message = [e];
  }
  return result;
}

async function update_table(table_name, update_values, where_clause = null){
  try{
    where_clause = where_clause ? where_clause : {};
    update_values.updated_at = new Date().toISOString().slice(0, 24);
    let updatedTable = await conn(table_name).returning('*').update(update_values).where(where_clause);
    result.done = true;
    if(updatedTable.length == 0){
      result.data = null;
    }else{
      result.data = updatedTable;
    }
  }catch(e){
    if(typeof e.code != 'undefined' && e.code == '23505'){
      if(e.constraint.includes('account_username')) result.code = 405.1;
      else if(e.constraint.includes('account_invite_code')) result.code = 405.2;
      else {
        console.log(e);
        result.code = 500.1;
      }
    }else{
      console.log(e);
      result.code = 500.1;
    }
    result.done = false;
    result.data = null;
    result.message = [e];
  }
  return result;
}

async function select_table(table_name, where_clause = null, andWhere_clause = null, orderBy1 = null, orderBy2 = null){
  try{
    where_clause = where_clause ? where_clause : {};
    where_clause.is_deleted = false;
    andWhere_clause = andWhere_clause ? andWhere_clause : [1, '=', 1];
    orderBy1 = orderBy1 ? orderBy1 : ['created_at', 'asc'];
    orderBy2 = orderBy2 ? orderBy2 : ['updated_at', 'asc'];

    var selectTable;
    if(andWhere_clause.length == 3) {
      selectTable = await conn.select('*').from(table_name).where(where_clause)
        .andWhere(andWhere_clause[0], andWhere_clause[1], andWhere_clause[2])
        .orderBy(orderBy1[0], orderBy1[1])
        .orderBy(orderBy2[0], orderBy2[1]);
    } else if(andWhere_clause.length == 6) {
      selectTable = await conn.select('*').from(table_name).where(where_clause)
        .andWhere(andWhere_clause[0], andWhere_clause[1], andWhere_clause[2])
        .andWhere(andWhere_clause[3], andWhere_clause[4], andWhere_clause[5])
        .orderBy(orderBy1[0], orderBy1[1])
        .orderBy(orderBy2[0], orderBy2[1]);
    }
    
    result.done = true;
    if(selectTable.length === 0){
      result.data = null;
    }else{
      result.data = selectTable;
    }
  }catch(e){
    console.log(e);
    result.done = false;
    result.data = null;
    result.message = [e];
  }
  return result;
}

async function delete_table(table_name, where_clause = null){
  try{
    where_clause = where_clause ? where_clause : {};
    await conn(table_name).del().where(where_clause);
    result.done = true;
    result.data = [];
  }catch(e){
    console.log(e);
    result.done = false;
    result.data = null;
    result.message = [e];
  }
  return result;
}

module.exports = {
  insert_table,
  update_table,
  select_table,
  delete_table
}
