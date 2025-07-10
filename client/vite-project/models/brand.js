class Brand {
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
  static add(brandList, brand) {
    brandList.push(brand);
    return brandList;
  }

  static remove(brandList, id) {
    return brandList.filter((brand) => brand.id !== id);
  }

  static update(brandList, id, newData) {
    return brandList.map((brand) => {
      if (brand.id === id) {
        Object.assign(brand, newData);
        brand.updatedAt = new Date().toISOString();
      }
      return brand;
    });
  }
}

export default Brand;
