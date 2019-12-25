var express = require('express');
var router = express.Router();
var Contagem = require('./contagem');


// xxx
router.get('/', (req, res) => {
    Contagem.find().exec((err, prods) => {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send(prods);
            console.log('get contagem - ok')
    })
})


// Obtenção da lista com id e data da contagem

router.get('/lista', (req, res) => {
    // db.student.find({}, {roll:1, _id:0})
    // Produto.find().sort({ tipoProduto: 1, nomeProduto: 1 }).exec((err, prods)
    Contagem.find({},{_id:1, dataContagem: 1}).sort({dataContagem: -1}).exec((err, prods) => {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send(prods);
        console.log('get contagem/lista - ok')
    })
})

router.post('/', (req, res) => {

    let p = new Contagem(req.body);

    console.log('Contagem - post');
    // console.log(p);

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

router.delete('/:id', (req, res) => {
    Contagem.deleteOne({ _id: req.params.id }, (err) => {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send({});
    })
})

module.exports = router;