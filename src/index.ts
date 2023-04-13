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
        const result = await db("users")

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

// Get Users by id
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

        res.status(201).send("Cadastro realizado com sucesso")

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

// Delete User by id
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
app.put("/users/:id", async(req: Request, res: Response)=>{
    try{
        const id = req.params.id
        
        const newEmail = req.body.email 
        const newPassword = req.body.password

        if(newEmail){
            if(typeof newEmail !== "string") {
                res.status(400)
                throw new Error("novo e-mail deve ser uma string")
            }
        }
        if(newEmail){
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

        usersToEdit.email = newEmail || usersToEdit.email
        usersToEdit.password = newPassword || usersToEdit.password
        
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
app.get("/products", async(req: Request, res: Response)=>{
    try{
        res.status(200).send(db("products"))
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

// Search Product by name
app.get("/products/search", async (req: Request, res: Response)=>{
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
app.post("/products",async  (req: Request, res: Response)=>{
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

        const newProduct:TProduct = {id, name, price, description, imageUrl}
        // products.push(newProduct)

        await db.raw(`
            INSERT INTO products (id, name, price, description, image_url)
            VALUES("${newProduct.id}", "${newProduct.name}", "${newProduct.price}", "${newProduct.description}", "${newProduct.imageUrl}")
        `)

        res.status(201).send("Produto cadastrado com sucesso")
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

// Edit Product by id
app.put("/products/:id", (req: Request, res: Response)=>{
    try{
        const id = req.params.id
        
        const newName = req.body.name
        const newPrice = req.body.price
        const newCategory = req.body.category

        //validar body
        if(typeof newName !== "string" && typeof newName !== "undefined"){
            throw new Error("'password' deve ser uma string")
        }
        if(typeof newPrice !== "number" && typeof newPrice !== "undefined"){
            throw new Error("'name' deve ser uma string")
        }
        // if(typeof newCategory !== "number"){
        //     throw new Error("'newCategory' deve ser ..............")
        // }
        
        //Validar que produto existe
        const productsToEdit = products.find((product)=> product.id === id)
        if(!productsToEdit){
            throw new Error("produto não encontrado")
        }

        productsToEdit.name = newName || productsToEdit.name
        productsToEdit.price = newPrice || productsToEdit.price
        // productsToEdit.category = newCategory || productsToEdit.category
        
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

app.delete("/products/:id", (req: Request, res: Response)=>{
    try{
        const id = req.params.id
        
        const indexProductToDelete = products.findIndex((product)=> product.id === id)
        
        if(indexProductToDelete >= 0){
            products.splice(indexProductToDelete, 1)
            res.status(200).send("Produto apagado com sucesso")
        } else {
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

//Get All Purchases 
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

// Get User Purchases by User id
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
        const paid = req.body.paid

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
        if(typeof paid !== "number"){
            throw new Error("'paid' deve ser uma number")
        }

        const [resultIdUser] = await db.raw(`
            SELECT * FROM users
            WHERE id = "${buyerId}"
        `)
        if(!resultIdUser){
            throw new Error("id do usuário que fez a compra deve existir no array de usuários cadastrados")
        }
        
        // //atualizar com valor correto
        // let totalPriceResult
        // for(let product of productList){
        //     totalPriceResult = totalPriceResult + (product.price * product.quantify)
        // }
        // output.totalPrice = totalPriceResult

        
        const newPurchase:TPurchase = {id, buyerId, totalPrice, paid}
        await db.raw(`
            INSERT INTO purchases (id, buyer_id, total_price, paid)
                VALUES(
                    "${newPurchase.id}",
                    "${newPurchase.buyerId}",
                    "${newPurchase.totalPrice}",
                    "${newPurchase.paid}"
            )
        `)
        

        res.status(201).send("Compra cadastrada com sucesso")
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
  
