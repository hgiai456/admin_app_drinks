import Joi from 'joi';
class InsertProductRequest {
    constructor(data) {
        this.name = data.name;
        this.description = data.name;
        this.image = data.image;
        this.brand_id = data.brand_id;
        this.category_id = data.category_id;
    }

    static validate(data) {
        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
            image: Joi.string().allow(''),
            category_id: Joi.number().min(0),
            brand_id: Joi.number().min(0)
        });
        return schema.validate(data);
    }
}
export default InsertProductRequest;
