class Size {
    constructor(id, name = '', createdAt = null, updatedAt = null) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
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
    setUpdatedAt(time) {
        this.updatedAt = time;
    }

    // Static methods for CRUD (optional, dùng cho mảng local)
    static add(list, size) {
        list.push(size);
        return list;
    }
    static remove(list, id) {
        return list.filter((size) => size.id !== id);
    }
    static update(list, id, newData) {
        return list.map((size) => {
            if (size.id === id) {
                Object.assign(size, newData);
                size.updatedAt = new Date().toISOString();
            }
            return size;
        });
    }
}

export default Size;
