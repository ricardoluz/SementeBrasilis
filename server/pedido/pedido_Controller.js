var express = require('express');
var router = express.Router();
// var Pedido = require('pedido_Schema');
// var Pedido = require('./pedido/pedido_Schema');
var Pedido = require('./pedido_Schema');


// Receber os dados do pedido.
router.get('/', (req, res) => {
    Pedido.find().exec((err, prods) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(200).send(prods);
            console.log('get Pedido - ok');
        }
    })
})


router.get('/:id', (req, res) => {
    Pedido.find({ _id: req.params.id }).exec((err, prods) => {
        if (err) {
            // console.log('get Pedido id: ', req.params.id, ' - erro')
            res.status(500).send(err);
        }
        else {
            res.status(200).send(prods);
            console.log('get Pedido id: ', req.params.id, ' - ok')
            // console.log(prods);
        }
    })
})


router.post('/', (req, res) => {

    let p = new Pedido(req.body);

    console.log('Pedido - post');

    p.save((err, prod) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        else {
            console.log('ok');
            res.status(200).send(prod);
        }
    })
})

module.exports = router;