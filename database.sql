-- Ensuring the name field is unique
ALTER TABLE products
ADD UNIQUE (name);

-- Setting default values and constraints for price, oldprice, quantity, and buyturn
ALTER TABLE products
MODIFY price INT DEFAULT 0,
ADD CONSTRAINT chk_price CHECK (price >= 0);

ALTER TABLE products
MODIFY oldprice INT DEFAULT 0,
ADD CONSTRAINT chk_oldprice CHECK (oldprice >= 0);

ALTER TABLE products
MODIFY quantity INT DEFAULT 0,
ADD CONSTRAINT chk_quantity CHECK (quantity >= 0);

ALTER TABLE products
MODIFY buyturn INT DEFAULT 0,
ADD CONSTRAINT chk_buyturn CHECK (buyturn >= 0);
