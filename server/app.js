const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const contagem_controller = require('./contagem_controller');
const produto_controller = require('./produto_controller');
const pedido_controller = require('./pedido/pedido_controller');

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

connectionString = "mongodb://localhost:27017/sb_v01";


mongoose.connect(
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


// const connectDB = async () => {
//     try {
//         await mongoose.connect(connectionString, {
//             useNewUrlParser: true,
//             useCreateIndex: true,
//             useUnifiedTopology: true,
//             useFindAndModify: false
//         });
//         console.log("MongoDB Conected")
//     } catch (err) {
//                 console.error(err.message);
//             process.exit(1);
//         }
//     };

//     connectDB;

app.use('/produto', produto_controller);
app.use('/contagem', contagem_controller);
app.use('/pedido', pedido_controller);

app.listen(3000);