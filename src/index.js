import express, { json } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { executeQuery,selectProducts,insertCustomer } from "./config/database.js";

const app = express();

// Middleware JSON
app.use(express.json());

// Middleware CORS
app.use(cors());

// EJS
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// Rotas
app.get("/product", function(req, res){
    res.render('registration');
});

app.post("/register", function(req, res){
    let codeIdentify  = req.body.id_identificador;
    let barCode  = req.body.code;
    let valueCurrent  = req.body.value;
    
    let codeValue = barCode ? barCode : codeIdentify
    
    let bdWhere;
    if (barCode === "") {
        bdWhere = "ID_IDENTIFICADOR"
    } else {
        bdWhere = "COD_BARRA"
    }
    
    let ssql = `UPDATE TB_EST_PRODUTO SET QTD_ATUAL = ${valueCurrent} WHERE ${bdWhere} = '${codeValue}'`;
    console.log(ssql)
    
    executeQuery(ssql, [], function(err, result){
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result)

        }
    }); 
    
    res.redirect("/product")
     
});

app.get("/bdmysql", function(req, res){  

    // Insert
(async () => {
    console.log('Começou!');   
    console.log('INSERT INTO COMPUFOUR');
    const result = await insertCustomer({ID_IDENTIFICADOR: 50, NOME: "Thiago", COD_BARRA: "7894561230", QTD_ATUAL: 12 });

    // Select
    console.log('SELECT * FROM COMPUFOUR');
    const products = await selectProducts();
    console.log(products);
    res.send(products)
})();
});

app.listen(9898, function(){
    console.log("Servidor no ar http://localhost:9898/product");
});
