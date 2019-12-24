var express = require('express');
var router = express.Router();
var Produto = require('./produto');


// xxx
router.get('/', (req, res) => {
    Produto.find().sort({tipoProduto:  1, nomeProduto: 1}).exec((err, prods) => {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send(prods);
    })
})

router.post('/', (req, res) => {
    console.log('Produto - post');
    // console.log(req.body);
    let p = new Produto({
        nomeProduto: req.body.nomeProduto,
        grupoProduto: req.body.grupoProduto,
        tipoProduto: req.body.tipoProduto,
        unCompra: req.body.unCompra,
        qtdeMinima: req.body.qtdeMinima,
        estoque: {
            unEstoque1: req.body.estoque.unEstoque1,
            rlEstoqueCompra1: req.body.estoque.rlEstoqueCompra1,
            unEstoque2: req.body.estoque.unEstoque2,
            rlEstoqueCompra2: req.body.estoque.rlEstoqueCompra2,
        },
    });
    p.save((err, prod) => {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send(prod);
    })
})

router.delete('/:id', (req, res) => {
    Produto.deleteOne({_id: req.params.id}, (err) => {
        if(err)
            res.status(500).send(err);
        else    
            res.status(200).send({});
    })
})

router.patch('/:id', (req, res) => {
    console.warn('Produto - patch');
    console.log(req.body);
    Produto.findById(req.params.id, (err, prod) => {
        if (err)
            res.status(500).send(err);
        else if (!prod)
            res.status(404).send({});
        else {
            prod.nomeProduto = req.body.nomeProduto;
            prod.grupoProduto = req.body.grupoProduto;
            prod.tipoProduto = req.body.tipoProduto;
            
            prod.unCompra = req.body.unCompra;
            prod.qtdeMinima= req.body.qtdeMinima;

            prod.estoque.unEstoque1 = req.body.estoque.unEstoque1;
            prod.estoque.rlEstoqueCompra1 = req.body.estoque.rlEstoqueCompra1;
            prod.estoque.unEstoque2 = req.body.estoque.unEstoque2;
            prod.estoque.rlEstoqueCompra2 = req.body.estoque.rlEstoqueCompra2;

            prod.save((err, prod)=>{
                if (err)
                    res.status(500).send(err);                
                else
                    res.status(200).send(prod);
            })
        }
    })
})

module.exports = router;









