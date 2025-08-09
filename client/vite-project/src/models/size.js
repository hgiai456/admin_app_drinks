class Size {
    constructor(id, name = '', createdAt = null, updatedAt = null) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ✅ STATIC METHOD - fromApiResponse (giống Category và Brand)
    static fromApiResponse(data) {
        if (!data) {
            console.error('❌ Data trống trong Size fromApiResponse');
            return null;
        }

        return new Size(
            data.id,
            data.name || '',
            data.createdAt,
            data.updatedAt
        );
    }

    // ✅ INSTANCE METHOD - toApiFormat (giống Category và Brand)
    toApiFormat() {
        return {
            id: this.id,
            name: this.name
        };
    }

    // ✅ GETTERS
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

    // ✅ ENHANCED GETTERS - Business Logic
    getFormattedName() {
        return this.name ? this.name.trim() : '';
    }

    getDisplayName() {
        return this.name ? this.name.toUpperCase() : '';
    }

    // ✅ SETTERS
    setName(name) {
        this.name = name;
    }

    setUpdatedAt(time) {
        this.updatedAt = time;
    }

    // ✅ UTILITY METHODS
    isValid() {
        return !!(this.name && this.name.trim().length > 0);
    }

    validate() {
        const errors = [];

        if (!this.name || this.name.trim().length === 0) {
            errors.push('Tên kích thước không được trống');
        } else if (this.name.trim().length < 1) {
            errors.push('Tên kích thước phải có ít nhất 1 ký tự');
        } else if (this.name.length > 50) {
            errors.push('Tên kích thước không được dài quá 50 ký tự');
        }

        return errors;
    }

    // ✅ STATIC METHODS - CRUD (không mutate array - theo cấu trúc Category)
    static add(sizeList, size) {
        return [...sizeList, size];
    }

    static remove(sizeList, id) {
        return sizeList.filter((size) => size.id !== id);
    }

    static update(sizeList, id, newData) {
        return sizeList.map((size) => {
            if (size.id === id) {
                return {
                    ...size,
                    ...newData,
                    updatedAt: new Date().toISOString()
                };
            }
            return size;
        });
    }

    // ✅ STATIC UTILITY METHODS
    static findById(sizeList, id) {
        return sizeList.find((size) => size.id === id) || null;
    }

    static findByName(sizeList, name) {
        return sizeList.filter((size) =>
            size.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    static sortByName(sizeList, ascending = true) {
        return [...sizeList].sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (ascending) {
                return nameA.localeCompare(nameB);
            } else {
                return nameB.localeCompare(nameA);
            }
        });
    }

    static sortByCreatedDate(sizeList, ascending = true) {
        return [...sizeList].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return ascending ? dateA - dateB : dateB - dateA;
        });
    }

    static getActiveSizes(sizeList) {
        // Sizes are active if they have a name
        return sizeList.filter(
            (size) => size.name && size.name.trim().length > 0
        );
    }

    // ✅ SIZE-SPECIFIC UTILITY METHODS
    static getSizesByType(sizeList, type = 'all') {
        // Type có thể là: 'small', 'medium', 'large', 'extra', 'all'
        const lowerCaseSizes = sizeList.map((size) => ({
            ...size,
            lowerName: size.name.toLowerCase()
        }));

        switch (type.toLowerCase()) {
            case 'small':
                return lowerCaseSizes.filter(
                    (size) =>
                        size.lowerName.includes('s') ||
                        size.lowerName.includes('small') ||
                        size.lowerName.includes('nhỏ')
                );
            case 'medium':
                return lowerCaseSizes.filter(
                    (size) =>
                        size.lowerName.includes('m') ||
                        size.lowerName.includes('medium') ||
                        size.lowerName.includes('vừa')
                );
            case 'large':
                return lowerCaseSizes.filter(
                    (size) =>
                        size.lowerName.includes('l') ||
                        size.lowerName.includes('large') ||
                        size.lowerName.includes('lớn')
                );
            case 'extra':
                return lowerCaseSizes.filter(
                    (size) =>
                        size.lowerName.includes('xl') ||
                        size.lowerName.includes('extra') ||
                        size.lowerName.includes('siêu')
                );
            default:
                return sizeList;
        }
    }

    static getCommonSizes() {
        // Trả về các size phổ biến
        return ['S', 'M', 'L', 'XL', 'XXL'];
    }

    static getDrinkSizes() {
        // Trả về các size cho đồ uống
        return ['Nhỏ', 'Vừa', 'Lớn', 'Siêu lớn'];
    }

    // ✅ VALIDATION HELPERS
    static validateName(name) {
        if (!name || name.trim().length === 0) {
            return 'Tên kích thước không được trống';
        }
        if (name.trim().length < 1) {
            return 'Tên kích thước phải có ít nhất 1 ký tự';
        }
        if (name.length > 50) {
            return 'Tên kích thước không được dài quá 50 ký tự';
        }
        return null;
    }

    static isValidSizeName(name) {
        if (!name || typeof name !== 'string') return false;

        const trimmedName = name.trim();
        return trimmedName.length >= 1 && trimmedName.length <= 50;
    }

    static isDuplicateName(sizeList, name, excludeId = null) {
        const lowerName = name.toLowerCase().trim();
        return sizeList.some(
            (size) =>
                size.name.toLowerCase().trim() === lowerName &&
                size.id !== excludeId
        );
    }

    // ✅ COMPARISON METHODS
    equals(otherSize) {
        if (!(otherSize instanceof Size)) return false;
        return this.id === otherSize.id && this.name === otherSize.name;
    }

    clone() {
        return new Size(this.id, this.name, this.createdAt, this.updatedAt);
    }

    // ✅ FORMAT METHODS
    toSelectOption() {
        return {
            value: this.id,
            label: this.name,
            text: this.name
        };
    }

    toTableRow() {
        return {
            id: this.id,
            name: this.name,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    // ✅ STRING REPRESENTATION
    toString() {
        return `Size{id: ${this.id}, name: "${this.name}"}`;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

export default Size;
