class Store {
  constructor(
    id,
    storeName,
    address,
    phoneNumber,
    image = null,
    openTime = null,
    closeTime = null,
    createdAt = null,
    updatedAt = null
  ) {
    this.id = id;
    this.storeName = storeName;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.image = image;
    this.openTime = openTime;
    this.closeTime = closeTime;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Getters
  getId() {
    return this.id;
  }
  getStoreName() {
    return this.storeName;
  }
  getAddress() {
    return this.address;
  }
  getPhoneNumber() {
    return this.phoneNumber;
  }
  getImage() {
    return this.image;
  }
  getOpenTime() {
    return this.openTime;
  }
  getCloseTime() {
    return this.closeTime;
  }
  getCreatedAt() {
    return this.createdAt;
  }
  getUpdatedAt() {
    return this.updatedAt;
  }

  // Setters
  setStoreName(name) {
    this.storeName = name;
  }
  setAddress(address) {
    this.address = address;
  }
  setPhoneNumber(phone) {
    this.phoneNumber = phone;
  }
  setImage(image) {
    this.image = image;
  }
  setOpenTime(time) {
    this.openTime = time;
  }
  setCloseTime(time) {
    this.closeTime = time;
  }
  setUpdatedAt(time) {
    this.updatedAt = time;
  }

  // Static methods for CRUD
  static add(storeList, store) {
    storeList.push(store);
    return storeList;
  }

  static remove(storeList, id) {
    return storeList.filter((store) => store.id !== id);
  }

  static update(storeList, id, newData) {
    return storeList.map((store) => {
      if (store.id === id) {
        Object.assign(store, newData);
        store.updatedAt = new Date().toISOString();
      }
      return store;
    });
  }
}

module.exports = Store;
