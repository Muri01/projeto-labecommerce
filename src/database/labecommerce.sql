-- Active: 1680630892141@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT(DATETIME('now', 'localtime'))
);

CREATE TABLE products(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    image_url TEXT
);

CREATE TABLE purchases(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    buyer_id TEXT NOT NULL,
    total_price REAL NOT NULL,
    created_at TEXT DEFAULT(DATETIME('now', 'localtime')),
    paid INTEGER NOT NULL DEFAULT(0),
    FOREIGN KEY (buyer_id) REFERENCES users(id)
);


-- EXERCICIO 1
CREATE TABLE purchases_products(
    purchases_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantify INTEGER NOT NULL,
    FOREIGN KEY (purchases_id) REFERENCES purchases(id)
    FOREIGN KEY (product_id) REFERENCES products(id)
);

SELECT * FROM purchases_products;
DROP TABLE purchases_products;

SELECT * FROM users;
SELECT * FROM products;
SELECT * FROM purchases;
SELECT * FROM purchases_products;
DROP TABLE users;
DROP TABLE products;
DROP TABLE purchases;


DROP TABLE purchases_products;

INSERT INTO users(id, name, email, password)
VALUES
    ("u001", "user1", "user1@email.com", "123456"),
    ("u002", "user2", "user2@email.com", "abcdef");

INSERT INTO products 
VALUES
    ("p001", "Arroz", 5.90, "Grão", "picsum.com/200"),
    ("p002", "macarrão", 10.50, "massa", "picsum.com/200"),
    ("p003", "feijão", 6.20, "Grão", "picsum.com/200"),
    ("p004", "suco", 9.64, "bebidas", "picsum.com/200"),
    ("p005", "maça", 2.12, "frutas", "picsum.com/200");


INSERT INTO purchases (id, total_price, buyer_id)
VALUES
    ("c001", 5.90, "u001"),
    ("c002", 10.50, "u001"),
    ("c003", 6.20, "u001"),
    ("c004", 9.64, "u001");


-- EXERCICIO 2
INSERT INTO purchases_products
VALUES
    ("c001", "p001", 5),
    ("c002", "p002", 10),
    ("c003", "p005", 6),
    ("c004", "p003", 9);

SELECT * FROM products;

SELECT * FROM purchases_products
INNER JOIN products
ON purchases_products.product_id = products.id;


SELECT * FROM purchases 
INNER JOIN users 
ON purchases.buyer_id = users.id;


-- Get all Users
SELECT * FROM users;

-- Get All Products
SELECT * FROM products;

-- Search Product by name
SELECT * FROM products WHERE name = "feijão";

-- Create User
INSERT INTO users
VALUES ("u003", "user3@email.com", "654321");

-- Create User
INSERT INTO products
VALUES ("u006", "Pão", 12.50, "Café");


-- Get Products by id
SELECT * FROM products 
WHERE id = "p002";

-- Delete User by id
DELETE FROM users
WHERE id = "u001";

-- Delete Product by id
DELETE FROM products
WHERE id = "p001";

-- Edit User by id
UPDATE users
SET password = "bananinha123"
WHERE id = "p002";

-- Edit Purchases by id
UPDATE purchases 
SET delivered_at = DATETIME()
WHERE id = "c002";

-- Edit Product by id
UPDATE products
SET price = 100.55, category = "teste"
WHERE id = "p001";

SELECT * FROM users;
SELECT * FROM products;

-- Get All Users
-- retorna o resultado ordenado pela coluna email em ordem crescente
SELECT * FROM users
ORDER BY email ASC;

-- Get All Products versão 1
-- retorna o resultado ordenado pela coluna price em ordem crescente
-- limite o resultado em 20 iniciando pelo primeiro item
SELECT * FROM products
ORDER BY price ASC
LIMIT 20 OFFSET 0;

-- Get All Products versão 2
-- seleção de um intervalo de preços, por exemplo entre 100.00 e 300.00
-- retorna os produtos com preços dentro do intervalo definido em ordem crescente
SELECT * FROM products
WHERE price >=  3 AND price <= 11
ORDER BY price ASC;