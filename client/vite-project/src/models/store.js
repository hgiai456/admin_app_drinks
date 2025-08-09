class Store {
    constructor(
        id,
        storeName = '',
        address = '',
        phoneNumber = '',
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

    // ✅ STATIC METHOD - fromApiResponse (giống Category và Brand)
    static fromApiResponse(data) {
        if (!data) {
            console.error('❌ Data trống trong Store fromApiResponse');
            return null;
        }

        return new Store(
            data.id,
            data.storeName || data.store_name || '',
            data.address || '',
            data.phoneNumber || data.phone_number || '',
            data.image || null,
            data.openTime || data.open_time || null,
            data.closeTime || data.close_time || null,
            data.createdAt,
            data.updatedAt
        );
    }

    // ✅ INSTANCE METHOD - toApiFormat (giống Category và Brand)
    toApiFormat() {
        return {
            id: this.id,
            storeName: this.storeName,
            address: this.address,
            phoneNumber: this.phoneNumber,
            image: this.image,
            openTime: this.openTime,
            closeTime: this.closeTime
        };
    }

    // ✅ GETTERS
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

    // ✅ ENHANCED GETTERS - Business Logic
    getFormattedStoreName() {
        return this.storeName ? this.storeName.trim() : '';
    }

    getImageUrl() {
        if (!this.image) return '/default-store.png';
        if (this.image.startsWith('http')) return this.image;
        if (this.image.startsWith('/')) return this.image;
        return `/images/stores/${this.image}`;
    }

    getFormattedPhone() {
        if (!this.phoneNumber) return '-';
        const cleaned = this.phoneNumber.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return `${cleaned.slice(0, 4)} ${cleaned.slice(
                4,
                7
            )} ${cleaned.slice(7)}`;
        }
        return this.phoneNumber;
    }

    getFormattedOpenTime() {
        if (!this.openTime) return '-';
        return this.openTime.slice(0, 5); // HH:MM format
    }

    getFormattedCloseTime() {
        if (!this.closeTime) return '-';
        return this.closeTime.slice(0, 5); // HH:MM format
    }

    getWorkingHours() {
        if (!this.openTime || !this.closeTime) return 'Chưa cập nhật';
        return `${this.getFormattedOpenTime()} - ${this.getFormattedCloseTime()}`;
    }

    // ✅ SETTERS
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

    // ✅ UTILITY METHODS
    isValid() {
        return !!(
            this.storeName &&
            this.storeName.trim().length > 0 &&
            this.address &&
            this.address.trim().length > 0 &&
            this.phoneNumber &&
            this.phoneNumber.trim().length > 0
        );
    }

    validate() {
        const errors = [];

        if (!this.storeName || this.storeName.trim().length === 0) {
            errors.push('Tên cửa hàng không được trống');
        } else if (this.storeName.length > 255) {
            errors.push('Tên cửa hàng không được dài quá 255 ký tự');
        }

        if (!this.address || this.address.trim().length === 0) {
            errors.push('Địa chỉ không được trống');
        } else if (this.address.length > 500) {
            errors.push('Địa chỉ không được dài quá 500 ký tự');
        }

        if (!this.phoneNumber || this.phoneNumber.trim().length === 0) {
            errors.push('Số điện thoại không được trống');
        } else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(this.phoneNumber)) {
            errors.push('Số điện thoại không hợp lệ');
        }

        if (this.openTime && this.closeTime) {
            if (this.openTime >= this.closeTime) {
                errors.push('Giờ mở cửa phải trước giờ đóng cửa');
            }
        }

        return errors;
    }

    isOpen() {
        if (!this.openTime || !this.closeTime) return null;

        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(
            2,
            '0'
        )}:${String(now.getMinutes()).padStart(2, '0')}`;

        return currentTime >= this.openTime && currentTime <= this.closeTime;
    }

    // ✅ STATIC METHODS - CRUD (không mutate array - theo cấu trúc Category)
    static add(storeList, store) {
        return [...storeList, store];
    }

    static remove(storeList, id) {
        return storeList.filter((store) => store.id !== id);
    }

    static update(storeList, id, newData) {
        return storeList.map((store) => {
            if (store.id === id) {
                return {
                    ...store,
                    ...newData,
                    updatedAt: new Date().toISOString()
                };
            }
            return store;
        });
    }

    // ✅ STATIC UTILITY METHODS
    static findById(storeList, id) {
        return storeList.find((store) => store.id === id) || null;
    }

    static findByName(storeList, name) {
        return storeList.filter((store) =>
            store.storeName.toLowerCase().includes(name.toLowerCase())
        );
    }

    static findByAddress(storeList, address) {
        return storeList.filter((store) =>
            store.address.toLowerCase().includes(address.toLowerCase())
        );
    }

    static sortByName(storeList, ascending = true) {
        return [...storeList].sort((a, b) => {
            const nameA = a.storeName.toLowerCase();
            const nameB = b.storeName.toLowerCase();
            if (ascending) {
                return nameA.localeCompare(nameB);
            } else {
                return nameB.localeCompare(nameA);
            }
        });
    }

    static sortByCreatedDate(storeList, ascending = true) {
        return [...storeList].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return ascending ? dateA - dateB : dateB - dateA;
        });
    }

    static getActiveStores(storeList) {
        return storeList.filter((store) => store.isValid());
    }

    static getOpenStores(storeList) {
        return storeList.filter((store) => store.isOpen() === true);
    }

    static getStoresWithImages(storeList) {
        return storeList.filter(
            (store) => store.image && store.image.trim().length > 0
        );
    }

    // ✅ VALIDATION HELPERS
    static validateStoreName(name) {
        if (!name || name.trim().length === 0) {
            return 'Tên cửa hàng không được trống';
        }
        if (name.length > 255) {
            return 'Tên cửa hàng không được dài quá 255 ký tự';
        }
        return null;
    }

    static validateAddress(address) {
        if (!address || address.trim().length === 0) {
            return 'Địa chỉ không được trống';
        }
        if (address.length > 500) {
            return 'Địa chỉ không được dài quá 500 ký tự';
        }
        return null;
    }

    static validatePhoneNumber(phone) {
        if (!phone || phone.trim().length === 0) {
            return 'Số điện thoại không được trống';
        }
        if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(phone)) {
            return 'Số điện thoại không hợp lệ (VD: 0901234567)';
        }
        return null;
    }

    static validateWorkingHours(openTime, closeTime) {
        if (openTime && closeTime) {
            if (openTime >= closeTime) {
                return 'Giờ mở cửa phải trước giờ đóng cửa';
            }
        }
        return null;
    }

    static validateImage(imageUrl) {
        if (!imageUrl) return null; // Image is optional

        try {
            new URL(imageUrl);
            return null;
        } catch {
            if (imageUrl.startsWith('/') || !imageUrl.includes('://')) {
                return null; // Assume it's a valid relative path
            }
            return 'URL hình ảnh không hợp lệ';
        }
    }

    // ✅ COMPARISON METHODS
    equals(otherStore) {
        if (!(otherStore instanceof Store)) return false;
        return (
            this.id === otherStore.id &&
            this.storeName === otherStore.storeName &&
            this.address === otherStore.address &&
            this.phoneNumber === otherStore.phoneNumber
        );
    }

    clone() {
        return new Store(
            this.id,
            this.storeName,
            this.address,
            this.phoneNumber,
            this.image,
            this.openTime,
            this.closeTime,
            this.createdAt,
            this.updatedAt
        );
    }

    // ✅ FORMAT METHODS
    toSelectOption() {
        return {
            value: this.id,
            label: `${this.storeName} - ${this.address}`,
            text: this.storeName
        };
    }

    toTableRow() {
        return {
            id: this.id,
            storeName: this.storeName,
            address: this.address,
            phoneNumber: this.getFormattedPhone(),
            workingHours: this.getWorkingHours(),
            image: this.image,
            isOpen: this.isOpen(),
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    // ✅ STRING REPRESENTATION
    toString() {
        return `Store{id: ${this.id}, name: "${this.storeName}", address: "${this.address}"}`;
    }

    toJSON() {
        return {
            id: this.id,
            storeName: this.storeName,
            address: this.address,
            phoneNumber: this.phoneNumber,
            image: this.image,
            openTime: this.openTime,
            closeTime: this.closeTime,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

export default Store;
