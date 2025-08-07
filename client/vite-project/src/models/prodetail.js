class Prodetail {
    constructor(
        id,
        name,
        product_id = null,
        size_id = null,
        store_id = null,
        buyturn = null,
        specification = null,
        price = null,
        oldprice = null,
        quantity = null,
        img1 = null,
        img2 = null,
        img3 = null,
        createdAt = null,
        updatedAt = null
    ) {
        this.id = id;
        this.name = name;
        this.product_id = product_id;
        this.size_id = size_id;
        this.store_id = store_id;
        this.buyturn = buyturn;
        this.specification = specification;
        this.price = price;
        this.oldprice = oldprice;
        this.quantity = quantity;
        this.img1 = img1;
        this.img2 = img2;
        this.img3 = img3;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ✅ Sửa lỗi: thêm parameter 'data'
    static fromApiResponse(data) {
        if (!data) {
            console.error('❌ Data trống trong fromApiResponse');
            return null;
        }

        return new Prodetail(
            data.id,
            data.name,
            data.product_id,
            data.size_id,
            data.store_id,
            data.buyturn || 0,
            data.specification || '',
            data.price || 0,
            data.oldprice || 0,
            data.quantity || 0,
            data.img1,
            data.img2,
            data.img3,
            data.createdAt,
            data.updatedAt
        );
    }

    toApiFormat() {
        return {
            id: this.id,
            name: this.name,
            product_id: this.product_id,
            size_id: this.size_id,
            store_id: this.store_id,
            buyturn: this.buyturn,
            specification: this.specification,
            price: this.price,
            oldprice: this.oldprice,
            quantity: this.quantity,
            img1: this.img1,
            img2: this.img2,
            img3: this.img3
        };
    }

    // Getters
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getProductId() {
        return this.product_id;
    }
    getSizeId() {
        return this.size_id;
    }
    getStoreId() {
        return this.store_id;
    }
    getBuyturn() {
        return this.buyturn;
    }
    getSpecification() {
        return this.specification;
    }
    getPrice() {
        return this.price;
    }
    getOldPrice() {
        return this.oldprice;
    }
    getQuantity() {
        return this.quantity;
    }
    getImg1() {
        return this.img1;
    }
    getImg2() {
        return this.img2;
    }
    getImg3() {
        return this.img3;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }

    // Setters
    setName(name) {
        this.name = name;
    }
    setPrice(price) {
        this.price = price;
    }
    setOldPrice(oldprice) {
        this.oldprice = oldprice;
    }
    setQuantity(quantity) {
        this.quantity = quantity;
    }
    setImg1(img1) {
        this.img1 = img1;
    }
    setImg2(img2) {
        this.img2 = img2;
    }
    setImg3(img3) {
        this.img3 = img3;
    }
    setUpdatedAt(time) {
        this.updatedAt = time;
    }

    // ✅ Sửa Static methods để không mutate array
    static add(list, item) {
        return [...list, item];
    }

    static remove(list, id) {
        return list.filter((item) => item.id !== id);
    }

    static update(list, id, newData) {
        return list.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    ...newData,
                    updatedAt: new Date().toISOString()
                };
            }
            return item;
        });
    }
}

export default Prodetail;
