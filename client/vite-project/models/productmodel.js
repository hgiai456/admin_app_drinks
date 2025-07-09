class Product {
  constructor(
    id,
    name = "",
    description = "",
    image = "",
    brand_id = 0,
    category_id = 0,
    createdAt = null,
    updatedAt = null
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.brand_id = brand_id;
    this.category_id = category_id;
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
  setUpdatedAt(time) {
    this.updatedAt = time;
  }

  // Static methods for CRUD (optional, dùng cho mảng local)
  static add(list, product) {
    list.push(product);
    return list;
  }
  static remove(list, id) {
    return list.filter((product) => product.id !== id);
  }
  static update(list, id, newData) {
    return list.map((product) => {
      if (product.id === id) {
        Object.assign(product, newData);
        product.updatedAt = new Date().toISOString();
      }
      return product;
    });
  }
}

export default Product;
