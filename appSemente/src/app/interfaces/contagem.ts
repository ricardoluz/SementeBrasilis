export interface Contagem {

    _id?: string;
    id?: string;
    dataContagem?: Date;
    linhaProduto: {
        nomeProduto: string;
        q1: number;
        un1: string;
        q2: number;
        un2: string;
        unCompra: string;
        qMinima: number;
        qTotal: number;
        precoCompra: number

    };

}
