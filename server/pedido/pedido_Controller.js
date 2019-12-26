var express = require('express');
var router = express.Router();
var Pedido = require('./pedido/pedido_Schema');


// Receber os dados da contagem
router.get('/', (req, res) => {
    Contagem.find().exec((err, prods) => {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send(prods);
        console.log('get contagem - ok')
    })
})

module.exports = router;