import { CATEGORY, TProduct, TPurchase, TUser } from "./types";

export const users:TUser[] = [
    {
        id: "u001",
        name: "user2",
        email: "user1@email.com",
        password: "123456"
    },
    {
        id: "u002",
        name: "user2",
        email: "user2@email.com",
        password: "abcdef"
    }
]

export const products:TProduct[] = [
    {
        id: "p001",
        name: "macarrão",
        price: 10.5,
        description: "string",
    imageUrl: "string"
    },
    {
        id: "p002",
        name: "arroz",
        price: 3,
        description: "string",
        imageUrl: "string"
    }
]

export const purchases: TPurchase[] = [
    {
        userId: "c001",
        productId: "p002",
        quantify: 5,
        totalPrice: 15
    },
    {
        userId: "c002",
        productId: "p002",
        quantify: 3,
        totalPrice: 9
    }
]


export const createUser = (id: string, email:string, password:string): TUser | void | string =>{
    // return {id, email, password}
    return "Cadastro realizado com sucesso"
}

export const getAllUser = (): TUser[] =>{
    return users
}


export const createProduct = (id: string, name:string, categogy:CATEGORY): string=>{
    return "Produto criado com sucesso"
}

export const getAllProduct = (): TProduct[]=>{
    return products
}

export const getProductById = (idToSearch: string): TProduct | undefined =>{
    const result = products.find((product)=> product.id === idToSearch)
    return result
}

