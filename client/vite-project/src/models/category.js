class Category {
    constructor(id, name, image = null, createdAt = null, updatedAt = null) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ✅ STATIC METHOD - fromApiResponse (giống Product)
    static fromApiResponse(data) {
        if (!data) {
            console.error('❌ Data trống trong Category fromApiResponse');
            return null;
        }

        return new Category(
            data.id,
            data.name || '',
            data.image || null,
            data.createdAt,
            data.updatedAt
        );
    }

    // ✅ INSTANCE METHOD - toApiFormat (giống Product)
    toApiFormat() {
        return {
            id: this.id,
            name: this.name,
            image: this.image
        };
    }

    // Getters
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getImage() {
        return this.image;
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
    setImage(image) {
        this.image = image;
    }
    setUpdatedAt(time) {
        this.updatedAt = time;
    }

    // Static methods for CRUD (không mutate array)
    static add(categoryList, category) {
        return [...categoryList, category];
    }

    static remove(categoryList, id) {
        return categoryList.filter((category) => category.id !== id);
    }

    static update(categoryList, id, newData) {
        return categoryList.map((category) => {
            if (category.id === id) {
                return {
                    ...category,
                    ...newData,
                    updatedAt: new Date().toISOString()
                };
            }
            return category;
        });
    }
}

export default Category;
