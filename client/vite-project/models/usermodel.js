class User {
  constructor(
    id,
    email,
    password = "",
    name = "",
    role = 0,
    avatar = "",
    phone = "",
    address = "",
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
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
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
