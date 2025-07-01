import Joi from 'joi';

class InsertBannerDetailRequest {
    constructor(data) {
        this.product_id = data.product_id;
        this.banner_id = data.banner_id;
    }

    static validate(data) {
        const schema = Joi.object({
            product_id: Joi.number().required(), // Status must be an integer greater than 0
            banner_id: Joi.number().required()
        });

        return schema.validate(data); // Returns { error, value }
    }
}

export default InsertBannerDetailRequest;
