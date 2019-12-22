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

module.exports = router;