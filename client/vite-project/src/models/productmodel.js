class Product {
    constructor(
        id,
        name = '',
        description = '',
        image = '',
        brand_id = 0,
        category_id = 0,
        status = 1,
        price = 0,
        createdAt = null,
        updatedAt = null
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
        this.brand_id = brand_id;
        this.category_id = category_id;
        this.status = status;
        this.price = price;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ✅ STATIC METHOD - fromApiResponse (theo cấu trúc Prodetail)
    static fromApiResponse(data) {
        if (!data) {
            console.error('❌ Data trống trong Product fromApiResponse');
            return null;
        }

        return new Product(
            data.id,
            data.name || '',
            data.description || '',
            data.image || '',
            data.brand_id || 0,
            data.category_id || 0,
            data.status !== undefined ? data.status : 1,
            data.price || 0,
            data.createdAt,
            data.updatedAt
        );
    }

    // ✅ INSTANCE METHOD - toApiFormat (theo cấu trúc Prodetail)
    toApiFormat() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            image: this.image,
            brand_id: this.brand_id,
            category_id: this.category_id,
            status: this.status,
            price: this.price
        };
    }

    // ✅ GETTERS - Đầy đủ như Prodetail
    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    getImage() {
        return this.image;
    }

    getBrandId() {
        return this.brand_id;
    }

    getCategoryId() {
        return this.category_id;
    }

    getStatus() {
        return this.status;
    }

    getPrice() {
        return this.price;
    }

    getCreatedAt() {
        return this.createdAt;
    }

    getUpdatedAt() {
        return this.updatedAt;
    }

    // ✅ ENHANCED GETTERS - Business Logic
    getFormattedName() {
        return this.name ? this.name.trim() : '';
    }

    getFormattedPrice() {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(this.price || 0);
    }

    getStatusText() {
        return this.status === 1 ? 'Hoạt động' : 'Ngừng hoạt động';
    }

    getImageUrl() {
        if (!this.image) return '/default-product.png';
        if (this.image.startsWith('http')) return this.image;
        if (this.image.startsWith('/')) return this.image;
        return `/images/products/${this.image}`;
    }

    // ✅ SETTERS - Theo cấu trúc Prodetail
    setName(name) {
        this.name = name;
    }

    setDescription(description) {
        this.description = description;
    }

    setImage(image) {
        this.image = image;
    }

    setBrandId(brand_id) {
        this.brand_id = brand_id;
    }

    setCategoryId(category_id) {
        this.category_id = category_id;
    }

    setStatus(status) {
        this.status = status;
    }

    setPrice(price) {
        this.price = price;
    }

    setUpdatedAt(time) {
        this.updatedAt = time;
    }

    // ✅ UTILITY METHODS
    isActive() {
        return this.status === 1;
    }

    toggleStatus() {
        this.status = this.status === 1 ? 0 : 1;
        this.setUpdatedAt(new Date().toISOString());
        return this.status;
    }

    // ✅ VALIDATION
    isValid() {
        return !!(
            this.name &&
            this.name.trim().length > 0 &&
            this.brand_id > 0 &&
            this.category_id > 0
        );
    }

    validate() {
        const errors = [];

        if (!this.name || this.name.trim().length === 0) {
            errors.push('Tên sản phẩm không được trống');
        }

        if (!this.category_id || this.category_id <= 0) {
            errors.push('Danh mục không được trống');
        }

        if (!this.brand_id || this.brand_id <= 0) {
            errors.push('Thương hiệu không được trống');
        }

        if (this.price < 0) {
            errors.push('Giá không được âm');
        }

        return errors;
    }

    // ✅ STATIC METHODS - Theo cấu trúc Prodetail (không mutate array)
    static add(list, product) {
        return [...list, product];
    }

    static remove(list, id) {
        return list.filter((product) => product.id !== id);
    }

    static update(list, id, newData) {
        return list.map((product) => {
            if (product.id === id) {
                return {
                    ...product,
                    ...newData,
                    updatedAt: new Date().toISOString()
                };
            }
            return product;
        });
    }

    // ✅ THÊM CÁC STATIC METHODS HỮU ÍCH
    static findById(list, id) {
        return list.find((product) => product.id === id) || null;
    }

    static findByName(list, name) {
        return list.filter((product) =>
            product.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    static findByCategory(list, categoryId) {
        return list.filter((product) => product.category_id === categoryId);
    }

    static findByBrand(list, brandId) {
        return list.filter((product) => product.brand_id === brandId);
    }

    static getActiveProducts(list) {
        return list.filter((product) => product.status === 1);
    }
}

export default Product;
