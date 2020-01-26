export interface Pedido {

    _id?: string;
    id: string;
    dataPedido: Date;
    dataContagem?: Date;
    linhaProduto: {
        nomeProduto: string;
        q1: number;
        un1: string;
        q2: number;
        un2: string;
        unCompra: string;
        qMinima: number
        qPedido: number,
        precoCompra: number,
        valorCompra: number
    };
}
