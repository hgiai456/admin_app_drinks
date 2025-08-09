class Brand {
    constructor(id, name, image = null, createdAt = null, updatedAt = null) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ✅ STATIC METHOD - fromApiResponse (giống Category và Product)
    static fromApiResponse(data) {
        if (!data) {
            console.error('❌ Data trống trong Brand fromApiResponse');
            return null;
        }

        return new Brand(
            data.id,
            data.name || '',
            data.image || null,
            data.createdAt,
            data.updatedAt
        );
    }

    // ✅ INSTANCE METHOD - toApiFormat (giống Category và Product)
    toApiFormat() {
        return {
            id: this.id,
            name: this.name,
            image: this.image
        };
    }

    // ✅ GETTERS
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

    // ✅ ENHANCED GETTERS - Business Logic
    getFormattedName() {
        return this.name ? this.name.trim() : '';
    }

    getImageUrl() {
        if (!this.image) return '/default-brand.png';
        if (this.image.startsWith('http')) return this.image;
        if (this.image.startsWith('/')) return this.image;
        return `/images/brands/${this.image}`;
    }

    // ✅ SETTERS
    setName(name) {
        this.name = name;
    }

    setImage(image) {
        this.image = image;
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
            errors.push('Tên thương hiệu không được trống');
        } else if (this.name.trim().length < 2) {
            errors.push('Tên thương hiệu phải có ít nhất 2 ký tự');
        } else if (this.name.length > 255) {
            errors.push('Tên thương hiệu không được dài quá 255 ký tự');
        }

        return errors;
    }

    // ✅ STATIC METHODS - CRUD (không mutate array - theo cấu trúc Category)
    static add(brandList, brand) {
        return [...brandList, brand];
    }

    static remove(brandList, id) {
        return brandList.filter((brand) => brand.id !== id);
    }

    static update(brandList, id, newData) {
        return brandList.map((brand) => {
            if (brand.id === id) {
                return {
                    ...brand,
                    ...newData,
                    updatedAt: new Date().toISOString()
                };
            }
            return brand;
        });
    }

    // ✅ STATIC UTILITY METHODS
    static findById(brandList, id) {
        return brandList.find((brand) => brand.id === id) || null;
    }

    static findByName(brandList, name) {
        return brandList.filter((brand) =>
            brand.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    static sortByName(brandList, ascending = true) {
        return [...brandList].sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (ascending) {
                return nameA.localeCompare(nameB);
            } else {
                return nameB.localeCompare(nameA);
            }
        });
    }

    static sortByCreatedDate(brandList, ascending = true) {
        return [...brandList].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return ascending ? dateA - dateB : dateB - dateA;
        });
    }

    static getActiveBrands(brandList) {
        // Assuming brands are active if they have a name
        return brandList.filter(
            (brand) => brand.name && brand.name.trim().length > 0
        );
    }

    static getBrandsWithImages(brandList) {
        return brandList.filter(
            (brand) => brand.image && brand.image.trim().length > 0
        );
    }

    static getBrandsWithoutImages(brandList) {
        return brandList.filter(
            (brand) => !brand.image || brand.image.trim().length === 0
        );
    }

    // ✅ VALIDATION HELPERS
    static validateName(name) {
        if (!name || name.trim().length === 0) {
            return 'Tên thương hiệu không được trống';
        }
        if (name.trim().length < 2) {
            return 'Tên thương hiệu phải có ít nhất 2 ký tự';
        }
        if (name.length > 255) {
            return 'Tên thương hiệu không được dài quá 255 ký tự';
        }
        return null;
    }

    static validateImage(imageUrl) {
        if (!imageUrl) return null; // Image is optional

        // Basic URL validation
        try {
            new URL(imageUrl);
            return null;
        } catch {
            // If not a full URL, check if it's a valid path
            if (imageUrl.startsWith('/') || !imageUrl.includes('://')) {
                return null; // Assume it's a valid relative path
            }
            return 'URL hình ảnh không hợp lệ';
        }
    }

    // ✅ COMPARISON METHODS
    equals(otherBrand) {
        if (!(otherBrand instanceof Brand)) return false;
        return (
            this.id === otherBrand.id &&
            this.name === otherBrand.name &&
            this.image === otherBrand.image
        );
    }

    clone() {
        return new Brand(
            this.id,
            this.name,
            this.image,
            this.createdAt,
            this.updatedAt
        );
    }

    // ✅ STRING REPRESENTATION
    toString() {
        return `Brand{id: ${this.id}, name: "${this.name}", image: "${
            this.image || 'null'
        }"}`;
    }
}

export default Brand;
