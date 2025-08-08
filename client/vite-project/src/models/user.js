class User {
    constructor(
        id,
        email,
        password = '',
        name = '',
        role = 0,
        avatar = '',
        phone = '',
        address = '',
        is_locked = 0,
        password_changed_ad = null,
        createdAt = null,
        updatedAt = null
    ) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
        this.avatar = avatar;
        this.phone = phone;
        this.address = address;
        this.is_locked = is_locked;
        this.password_changed_ad = password_changed_ad;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromApiResponse(data) {
        if (!data) {
            console.error('❌ Data trống trong User fromApiResponse');
            return null;
        }

        return new User(
            data.id,
            data.email || '',
            data.password || '',
            data.name || '',
            data.role || 0,
            data.avatar || '',
            data.phone || '',
            data.address || '',
            data.is_locked || 0,
            data.password_changed_ad || null,
            data.createdAt,
            data.updatedAt
        );
    }

    // ✅ INSTANCE METHOD - toApiFormat
    toApiFormat() {
        return {
            id: this.id,
            email: this.email,
            name: this.name,
            role: this.role,
            avatar: this.avatar,
            phone: this.phone,
            address: this.address,
            is_locked: this.is_locked,
            password_changed_ad: this.password_changed_ad
        };
    }

    // Getters
    getId() {
        return this.id;
    }
    getEmail() {
        return this.email;
    }
    getPassword() {
        return this.password;
    }
    getName() {
        return this.name;
    }
    getRole() {
        return this.role;
    }
    getAvatar() {
        return this.avatar;
    }
    getPhone() {
        return this.phone;
    }
    getAddress() {
        return this.address;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }

    // Setters
    setEmail(email) {
        this.email = email;
    }
    setPassword(password) {
        this.password = password;
    }
    setName(name) {
        this.name = name;
    }
    setRole(role) {
        this.role = role;
    }
    setAvatar(avatar) {
        this.avatar = avatar;
    }
    setPhone(phone) {
        this.phone = phone;
    }
    setAddress(address) {
        this.address = address;
    }
    setUpdatedAt(time) {
        this.updatedAt = time;
    }

    // Static methods for CRUD (optional, dùng cho mảng local)
    static add(list, user) {
        list.push(user);
        return list;
    }
    static remove(list, id) {
        return list.filter((user) => user.id !== id);
    }
    static update(list, id, newData) {
        return list.map((user) => {
            if (user.id === id) {
                Object.assign(user, newData);
                user.updatedAt = new Date().toISOString();
            }
            return user;
        });
    }
}

export default User;
