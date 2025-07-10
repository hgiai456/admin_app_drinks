class Category {
  constructor(id, name, image = null, createdAt = null, updatedAt = null) {
    this.id = id;
    this.name = name;
    this.image = image;
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

  // Static methods for CRUD
  static add(categoryList, category) {
    categoryList.push(category);
    return categoryList;
  }

  static remove(categoryList, id) {
    return categoryList.filter((category) => category.id !== id);
  }

  static update(categoryList, id, newData) {
    return categoryList.map((category) => {
      if (category.id === id) {
        Object.assign(category, newData);
        category.updatedAt = new Date().toISOString();
      }
      return category;
    });
  }
}

export default Category;
