const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
// var mongoClient = require('mongodb').MongoClient;

const contagem_controller = require('./contagem_controller');
const produto_controller = require('./produto_controller');
const pedido_controller = require('./pedido/pedido_controller');

const app = express(express.static(__dirname));
console.log("dirname: " + __dirname);

// app.get('*', function (req, res) {
//     res.redirect('/appSemente/');
// });

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

// connectionString = "mongodb://localhost:27017/sb_v01";
connectionString = "mongodb+srv://user_sementebrasilis:LM0ttdrobq37lsxu@cluster0-ai33s.gcp.mongodb.net/sb_v01";

mongoose.connect(
// mongoClient.connect(
    connectionString,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    )
    .then(() => console.log('Conexão DB - ok - ', connectionString))
    .catch(err => {
        console.log('Erro de conexão');
        console.error(err)
        });


app.use('/produto', produto_controller);
app.use('/contagem', contagem_controller);
app.use('/pedido', pedido_controller);

console.log('ok');
app.listen(3000);