var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// TODO: Inserir as validações necessárias no esquema de dados (ou alterar via Mongo).

var linhaSchema = new Schema({
    nomeProduto: String,
    unCompra: String,
    qPedido: Number
})

var pedidoSchema = new Schema({
    dataPedido: Date,
    dataContagem: Date,
    linhaProduto: [linhaSchema],
}, { versionKey: false });


module.exports = mongoose.model("Pedido", pedidoSchema);