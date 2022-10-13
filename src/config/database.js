import firebird from "node-firebird";
import mysql from "mysql2/promise";

// Conexão com o banco de dados Firebird
const dbOptions = {
    host: 'localhost',
    port: 3050,
    database: 'C:\\Program Files (x86)\\CompuFour\\Clipp\\Base\\CLIPP.FDB',
    user: 'SYSDBA',
    password: 'masterkey',
    lowercase_keys: true, // set to true to lowercase keys
    role: null,            // default    
    pageSize: 4096        // default when creating database
};

function executeQuery(ssql, params, callback){

    firebird.attach(dbOptions, function(err, db) {
            
        if (err) {
            return callback(err, []); 
        } 

        db.query(ssql, params, function(err, result) {
            
            db.detach();

            if (err) {
                return callback(err, []);
            } else {
                return callback(undefined, result);
            }
        });

    });
}

// Conexão com o banco de dados Mysql
async function connect(){
    const connection = await mysql.createConnection("mysql://root:3103@localhost:3306/wilis");
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}

async function selectProducts(){
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM compufour;');
    return rows;
}

async function insertCustomer(customer){
    const conn = await connect();
    const sql = 'INSERT INTO compufour(ID_IDENTIFICADOR,COD_BARRA,NOME,QTD_ATUAL) VALUES (?,?,?,?);';
    const values = [customer.ID_IDENTIFICADOR, customer.COD_BARRA, customer.NOME, customer.QTD_ATUAL]
    return await conn.query(sql, values);
}

export {executeQuery, selectProducts, insertCustomer};
