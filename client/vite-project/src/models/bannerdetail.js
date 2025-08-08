class BannerDetail {
    constructor(id, product_id, banner_id, createdAt = null, updatedAt = null) {
        this.id = id;
        this.product_id = product_id;
        this.banner_id = banner_id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters
    getId() {
        return this.id;
    }
    getProductId() {
        return this.product_id;
    }
    getBannerId() {
        return this.banner_id;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }

    // Setters
    setProductId(product_id) {
        this.product_id = product_id;
    }
    setBannerId(banner_id) {
        this.banner_id = banner_id;
    }
    setUpdatedAt(time) {
        this.updatedAt = time;
    }

    // Static methods for CRUD (optional, dùng cho mảng local)
    static add(list, item) {
        list.push(item);
        return list;
    }
    static remove(list, id) {
        return list.filter((item) => item.id !== id);
    }
    static update(list, id, newData) {
        return list.map((item) => {
            if (item.id === id) {
                Object.assign(item, newData);
                item.updatedAt = new Date().toISOString();
            }
            return item;
        });
    }
}

export default BannerDetail;
