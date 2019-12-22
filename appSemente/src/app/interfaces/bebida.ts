export interface Bebida {
    _id?: string;
    nomeProduto: string;
    grupoProduto: string;
    tipoProduto: string;
    unCompra: string;
    qtdeMinima: number;
    estoque: {
        unEstoque1: string,
        rlEstoqueCompra1: number,
        unEstoque2: string,
        rlEstoqueCompra2: number,
    };
    unVenda: string;
    qtdeVenda: number;
}
