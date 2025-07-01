import Joi from 'joi';
class UpdateProductRequest {
    constructor(data) {
        this.name = data.name;
        this.description = data.description; // Fixed: was data.name
        this.image = data.image;
        this.brand_id = data.brand_id;
        this.category_id = data.category_id;
    }

    static validate(data) {
        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
            image: Joi.string().allow('').allow(null), // Updated: Allow empty string or null
            category_id: Joi.number().integer().min(1),
            brand_id: Joi.number().integer().min(1) // Added integer validation and min(1) for valid IDs
        });

        return schema.validate(data);
    }
}
export default UpdateProductRequest;
