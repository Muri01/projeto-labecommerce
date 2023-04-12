export enum CATEGORY {
    ACCESSORIES = "Acessórios",
    CLOTHES_AND_SHOES = "Roupas e calçados",
    ELECTRONICS = "Eletrônicos",
    MASSA = "Massa",
    GRAO = "Grão"
}

export type TUser = {
    id: string,
    name: string
    email: string,
    password: string
}

export type TProduct = {
    id: string,
    name: string,
    price: number,
    description: string
    imageUrl: string
}

export type TPurchase = {
    id: string,
    buyerId: string,
    totalPrice: number,
    paid: number
}