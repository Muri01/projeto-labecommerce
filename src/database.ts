import { CATEGORY, TProduct, TPurchase, TUser } from "./types";

export const users:TUser[] = [
    {
        id: "u001",
        name: "user1",
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
        description: "CATEGORY.MASSA",
        imageUrl: ""
    },
    {
        id: "p002",
        name: "arroz",
        price: 3,
        description: "CATEGORY.GRAO",
        imageUrl: ""
    }
]

export const purchases: TPurchase[] = [
    {
        id: "c001",
        buyerId: "p002",
        totalPrice: 15,
        paid: 1,
    },
    {
        id: "c002",
        buyerId: "p002",
        totalPrice: 9,
        paid: 0,
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

