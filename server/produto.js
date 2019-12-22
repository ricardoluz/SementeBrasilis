var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var produtoSchema = new Schema({
//     nomeProduto: String,
// }, {versionKey: false});


// TODO: Inserir as validações necessárias no esquema de dados (ou alterar via Mongo).

var produtoSchema = new Schema({
    grupoProduto: String,
    tipoProduto: String,
    nomeProduto: String,
    unCompra: String,
    qtdeMinima: Number,
    estoque: {
        unEstoque1: String,
        rlEstoqueCompra1: Number,
        unEstoque2: String,
        rlEstoqueCompra2: Number,
    },
    unVenda: String,
    qtdeVenda: Number,
}, { versionKey: false });

module.exports = mongoose.model("Produto", produtoSchema);
