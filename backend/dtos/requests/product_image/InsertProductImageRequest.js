import Joi from 'joi';
class InsertProductImageRequest {
    constructor(data) {
        this.image_url = data.image_url;
        this.product_id = data.product_id;
    }

    static validate(data) {
        const schema = Joi.object({
            product_id: Joi.number().integer().required(),
            image_url: Joi.string().required()
        });
        return schema.validate(data);
    }
}
export default InsertProductImageRequest;
