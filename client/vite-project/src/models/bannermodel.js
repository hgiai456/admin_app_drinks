// bannermodel.js
class Banner {
    constructor(
        id,
        name = null, // Đổi từ title thành name
        image = null,
        status = 1, // Thêm status field
        createdAt = null,
        updatedAt = null
    ) {
        this.id = id;
        this.name = name; // Đổi từ title thành name
        this.image = image;
        this.status = status; // Thêm status
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters
    getId() {
        return this.id;
    }
    getName() {
        // Đổi từ getTitle thành getName
        return this.name;
    }
    getImage() {
        return this.image;
    }
    getStatus() {
        // Thêm getStatus
        return this.status;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }

    // Setters
    setName(name) {
        // Đổi từ setTitle thành setName
        this.name = name;
    }
    setImage(image) {
        this.image = image;
    }
    setStatus(status) {
        // Thêm setStatus
        this.status = status;
    }
    setUpdatedAt(time) {
        this.updatedAt = time;
    }

    // Method để chuyển đổi thành plain object cho API
    toPlainObject() {
        return {
            id: this.id,
            name: this.name, // Đổi từ title thành name
            image: this.image,
            status: this.status, // Thêm status
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    // Static methods for CRUD
    static add(list, banner) {
        list.push(banner);
        return list;
    }

    static remove(list, id) {
        return list.filter((banner) => banner.id !== id);
    }

    static update(list, id, newData) {
        return list.map((banner) => {
            if (banner.id === id) {
                Object.assign(banner, newData);
                banner.updatedAt = new Date().toISOString();
            }
            return banner;
        });
    }
}

export default Banner;
