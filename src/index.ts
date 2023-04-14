import { products, purchases, users } from "./database"
import express, {Request, Response} from 'express';
import cors from 'cors'
import { CATEGORY, TProduct, TPurchase, TUser } from "./types";
import { db } from "./database/knex";

const app = express();

app.use(express.json());
app.use(cors());
 
app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});

// ======================= Users =======================
// Get All Users
app.get("/users", async (req: Request, res: Response) => {
    try {
        const result = await db.select(
            "id",
            "name", 
            "email", 
            "password", 
            "created_at as createdAt"
        ).from("users")

        res.status(200).send(result)
    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        if(error instanceof Error){
            res.send(error.message)
        } else{
            res.send("Erro inesperado")
        }
    }
})

// Get Users by id - X
app.get("/users/:id", async (req: Request, res: Response)=>{
    try{
        const id = req.params.id

        const result = await db("users").where({id: id})
        res.status(200).send(result)

    } catch(error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        if(error instanceof Error){
            res.send(error.message)
        } else{
            res.send("Erro inesperado")
        }
    }
})

// Create User
app.post("/users", async (req: Request, res: Response)=>{
    try{
        const id = req.body.id
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password

        // validar dados vindos do body
        if(typeof id !== "string"){
            throw new Error("'id' deve ser uma string")
        }
        if(typeof name !== "string"){
            throw new Error("'name' deve ser uma string")
        }
        if(typeof email !== "string"){
            throw new Error("'email' deve ser uma string")
        }
        if(typeof password !== "string"){
            throw new Error("'password' deve ser uma string")
        }
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
			throw new Error("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
		}
        
        //não deve ser possível criar mais de uma conta com a mesma id
        const [resultId] = await db(`users`).where({id})
        if(resultId){
            throw new Error("não deve ser possível criar mais de uma conta com a mesma id")
        }

        //não deve ser possível criar mais de uma conta com o mesmo e-mail
        const [resultEmail] = await db("users").where("email", email)
        if(resultEmail){
            throw new Error("não deve ser possível criar mais de uma conta com o mesmo e-mail")
        }

        const newUser:TUser = {id, name, email, password}

        await db("users").insert(newUser)

        res.status(201).send({message: "Cadastro realizado com sucesso"})

    } catch(error) {
        console.log(error)

        if(res.statusCode === 201){
            res.status(500)
        }

        if(error instanceof Error){
            res.send(error.message)
        } else{
            res.send("Erro inesperado")
        }
    }
})

// Delete User by id - X
app.delete("/users/:id",async (req: Request, res: Response)=>{
    try{
        const id = req.params.id

        const [ users ] = await db("users").where({id: id})
        
        if(users) {
            res.status(404)
            throw new Error("Usuário não encontrado")
        }
         
        await db("users").del().where({id: id})

        res.status(200).send("User apagado com sucesso")
    } catch(error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        if(error instanceof Error){
            res.send(error.message)
        } else{
            res.send("Erro inesperado")
        }
    }
})

// Edit User by id
app.put("/users/:id", async (req: Request, res: Response)=>{
    try{
        const id = req.params.id
        
        const newId = req.body.id 
        const newName = req.body.name 
        const newEmail = req.body.email 
        const newPassword = req.body.password

        if(newId){
            if(typeof newId !== "string") {
                res.status(400)
                throw new Error("novo id deve ser uma string")
            }
        }
        if(newName){
            if(typeof newName !== "string") {
                res.status(400)
                throw new Error("nova name deve ser uma string")
            }
        }
        if(newEmail){
            if(typeof newEmail !== "string") {
                res.status(400)
                throw new Error("novo e-mail deve ser uma string")
            }
        }
        if(newPassword){
            if(typeof newPassword !== "string") {
                res.status(400)
                throw new Error("nova senha deve ser uma string")
            }
        }
        
        const [usersToEdit] = await db("users").where({id})
        if(!usersToEdit){
            res.status(404)
            throw new Error("Usuário não encontrado")
        }

        const newUser: TUser = {
            id: newId || usersToEdit.id,
            name: newName || usersToEdit.name,
            email: newEmail || usersToEdit.email,
            password: newPassword || usersToEdit.password
        }

        await db("users").update(newUser).where({id})
        
        res.status(200).send("User atualizado com sucesso")

    }catch(error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        if(error instanceof Error){
            res.send(error.message)
        } else{
            res.send("Erro inesperado")
        }
    }
})

// ======================= Products =======================

// Get All Products
app.get("/products", async (req: Request, res: Response)=>{
    try{
        res.status(200).send(await db("products"))
    } catch(error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        if(error instanceof Error){
            res.send(error.message)
        } else{
            res.send("Erro inesperado")
        }
    }
})

// Search Product by name --> REVISAR!!!
app.get("/products/", async (req: Request, res: Response)=>{
    try {
        const q = req.query.q

        if(typeof q !== "string"){
            throw new Error("'q' deve ser uma string")
        }

        const result = await db.raw(`
            SELECT * FROM products
            WHERE name = "${q}"
        `)
        
        res.status(200).send(result)

    }catch(error){
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        if(error instanceof Error){
            res.send(error.message)
        } else{
            res.send("Erro inesperado")
        }
    }

})

// Get products by id
app.get("/products/:id", async (req: Request, res: Response)=>{
    try{
        const id = req.params.id
        
        const [result] = await db.raw(`
            SELECT * FROM products
            WHERE id = "${id}"
        `)

        if(!result){
            throw new Error("Produto não existe")
        }
        
        res.status(200).send(result)

    }catch(error){
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        if(error instanceof Error){
            res.send(error.message)
        } else{
            res.send("Erro inesperado")
        }
    }
})

// Create Product
app.post("/products",async (req: Request, res: Response)=>{
    try{
        const id = req.body.id
        const name = req.body.name
        const price = req.body.price
        const description = req.body.description 
        const imageUrl = req.body.imageUrl 

        //validar body
        if(typeof id !== "string"){
            throw new Error("'password' deve ser uma string")
        }
        if(typeof name !== "string"){
            throw new Error("'name' deve ser uma string")
        }
        if(typeof price !== "number"){
            throw new Error("'price' deve ser uma number")
        }
        if(typeof description !== "string"){
            throw new Error("'description' deve ser uma number")
        }
        if(typeof imageUrl !== "string"){
            throw new Error("'imageUrl' deve ser uma number")
        }
        
        //não deve ser possível criar mais de um produto com a mesma id
        const [resultId] = await db.raw(`
            SELECT * FROM products
            WHERE id = "${id}"
        `)
        if(resultId){
            throw new Error("não deve ser possível criar mais de uma produto com a mesma id")
        }

        const newProduct = {id, name, price, description, image_url: imageUrl}

        await db("products").insert(newProduct)

        res.status(201).send({message: "Produto cadastrado com sucesso"})
    }catch(error){
        console.log(error)

        if(res.statusCode === 201){
            res.status(500)
        }

        if(error instanceof Error){
            res.send(error.message)
        } else{
            res.send("Erro inesperado")
        }
    }
})

// Edit Product by id
app.put("/products/:id", async (req: Request, res: Response)=>{
    try{
        const id = req.params.id
        
        const newName = req.body.name
        const newPrice = req.body.price
        const newDescription = req.body.description
        const newImageUrl = req.body.imageUrl

        //validar body
        if( newName !== undefined){
            if(typeof newName !== "string"){
                res.status(400)
                throw new Error("'password' deve ser uma string")
            }
            if(newName.length < 2){
                res.status(400)
                throw new Error("'name' deveter mais que 2 caracteres")
            }
        }
        if(newPrice !== undefined){
            if(typeof newPrice !== "number"){
                res.status(400)
                throw new Error("'number' deve ser uma string")
            }
            if(newPrice === 0){
                res.status(400)
                throw new Error("'price' não pode ser zero")
            }
        }
        if(newDescription !== undefined){
            if(typeof newDescription !== "string"){
                res.status(400)
                throw new Error("'string' deve ser uma string")
            }
            if(newDescription.length < 5){
                res.status(400)
                console.log(newDescription.length)
                throw new Error("'Description' deve ter mais que 5 caracteres")
            }
        }
        if(newImageUrl !== undefined){
            if(typeof newImageUrl !== "string"){
                res.status(400)
                throw new Error("'number' deve ser uma string")
            }
            if(newImageUrl.length < 3){
                res.status(400)
                throw new Error("'ImageUrl' deve ter mais que 3 caracteres")
            }
        }
        
        //Validar que produto existe
        const [productsToEdit] = await db("products").where({ id})
        if(!productsToEdit){
            throw new Error("produto não encontrado")
        }

        const newProduct = {
            id: productsToEdit.id,
            name: newName || productsToEdit.name,
            price: newPrice || productsToEdit.price,
            description: newDescription || productsToEdit.description,
            image_url: newImageUrl || productsToEdit.image_url
        }

        await db("products").update(newProduct).where({id})
        
        res.status(200).send("produto apagado com sucesso")

    }  catch(error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        if(error instanceof Error){
            res.send(error.message)
        } else{
            res.send("Erro inesperado")
        }
    }
})

// Delete Product by id - X
app.delete("/products/:id", async (req: Request, res: Response)=>{
    try{
        const id = req.params.id
        
        const [indexProductToDelete] = await db("products").where({id})
        
        if(indexProductToDelete){
            await db("products").del().where({id})
            res.status(200).send("Produto apagado com sucesso")
        } else {
            res.status(400)
            throw new Error("Produto não encontrado")
        }
    }  catch(error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        if(error instanceof Error){
            res.send(error.message)
        } else{
            res.send("Erro inesperado")
        }
    }
})

// ======================= Purchases =======================

//Get All Purchases - X
app.get("/purchases", async(req: Request, res: Response)=>{
    try{
        const purchases = await db("purchases")
        res.status(200).send(purchases)
    }catch(error){
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        if(error instanceof Error){
            res.send(error.message)
        } else{
            res.send("Erro inesperado")
        }console.log(error)
    }
})

// Get User Purchases by User id - X
app.get("/users/:id/purchases", async (req: Request, res: Response)=>{
    try{
        const id = req.params.id
        
        const [resultUser] = await db("users").where({id: id})
        if(!resultUser){
            throw new Error("Usuário não existe")
        }

        const result = await db("users").where({id: id})
        if(!result){
            throw new Error("Compra não existe")
        }
        
        res.status(200).send(result)
    }catch(error){
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        if(error instanceof Error){
            res.send(error.message)
        } else{
            res.send("Erro inesperado")
        }
    }
})

// Get Purchase by id
app.get("/purchases/:id", async (req: Request, res: Response)=>{
    try{
        const id = req.params.id

        const [result] = await db("purchases").where({id: id})
        if(!result){
            throw new Error("Compra não existe")
        }

        const [output] = await db
            .select(
                "purchases.id as purchaseId",
                "purchases.total_price as totalPrice",
                "purchases.created_at as createdAt",
                "purchases.paid as isPaid",
                "users.email as email",
                "users.name as name"
            )
            .from("purchases")
            .innerJoin("users", "purchases.buyer_id", "=", "users.id")
            .where({"purchases.id": id})

        const productList = await db("purchases_products")
        .select(
            "purchases_id as id",
            "products.name as name",
            "products.price as price",
            "products.description as description",
            "products.image_url as imageUrl",
            "purchases_products.quantify as quantify",
        )
        .innerJoin("products", "purchases_products.product_id", "=", "products.id")
        .where({purchases_id: id})

        output.isPaid === 0 ? output.isPaid = false : output.isPaid = true
        
        res.status(200).send({...output, productList})
    }catch(error){
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        if(error instanceof Error){
            res.send(error.message)
        } else{
            res.send("Erro inesperado")
        }
    }
})

// Create Purchase
app.post("/purchases", async (req: Request, res: Response)=>{
    try{
        const id = req.body.id
        const buyerId = req.body.buyer
        const totalPrice = req.body.totalPrice
        const productsList = req.body.products

        //validar body
        if(typeof id !== "string"){
            throw new Error("'id' da compra deve ser uma string")
        }
        if(typeof buyerId !== "string"){
            throw new Error("'buyerId' deve ser uma string")
        }
        if(typeof totalPrice !== "number"){
            throw new Error("'totalPrice' deve ser uma number")
        }
        if(productsList.length < 0){
            throw new Error("'product' não pode ficar vazio")
        }

        const [resultIdUser] = await db(`users`).where({id: buyerId})
        if(!resultIdUser){
            throw new Error(" usuário não cadastrado")
        }

        let totalPriceCheck: number = 0
        //verificar os produtos que vieram na requisição existem
        for(let product of productsList){
            const [productExist] = await db(`users`).where({id: buyerId})
            if(!productExist){
                await db("purchases").del().where({id}) 
                throw new Error("Produto não encontrado")
            }
            
            // somar valor dos produtos para verificar se valor final esta correto
            totalPriceCheck = totalPriceCheck + (product.price * product.quantity)
        }
        console.log(totalPriceCheck)
        if(totalPriceCheck !== totalPrice){
            await db("purchases").del().where({id})
            res.status(404)
            throw new Error("Preço total não bate com a os valores dos produtos")
        }

        // criar comprar
        const newPurchase = {
            id, 
            buyer_id: buyerId, 
            total_price: totalPrice
        }
        await db("purchases").insert(newPurchase)

        // inserir produto na tabela relacional de compras e produtos
        for(let product of productsList){
            await db("purchases_products").insert({
                purchases_id: id,
                product_id: product.id,
                quantify: product.quantity
            })
        }

        res.status(201).send({message: "Pedido realizado com sucesso"})
    }catch(error){
        console.log(error)

        if(res.statusCode === 201){
            res.status(500)
        }

        if(error instanceof Error){
            res.send(error.message)
        } else{
            res.send("Erro inesperado")
        }
    }
})
  
app.delete("/purchases/:id", async (req: Request, res: Response)=>{
    try{
        const id = req.params.id
        
        const [indexPurchaseToDelete] = await db("purchases").where({id})
        
        if(indexPurchaseToDelete){
            await db("purchases_products").del().where({purchases_id: id})
            await db("purchases").del().where({id})
            res.status(200).send("Compra apagado com sucesso")
        } else {
            res.status(400)
            throw new Error("Compra não encontrado")
        }
    }  catch(error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        if(error instanceof Error){
            res.send(error.message)
        } else{
            res.send("Erro inesperado")
        }
    }
})