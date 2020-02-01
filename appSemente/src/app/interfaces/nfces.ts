export interface NFCEs {
    idNFCE: string;
    dataEmissao: string;
    serie: number;
    numeroNF: number;
    produtos: {
        codProduto: string,
        descricaoProduto: string,
        qtdeComprada: number,
        valorUnitario: number
    };
}
