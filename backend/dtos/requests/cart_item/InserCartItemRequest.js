import Joi from 'joi';

class InsertCartItemRequest {
    constructor(data) {
        this.cart_id = data.cart_id; // Image is optional
        this.product_detail_id = data.product_detail_id;
        this.quantity = data.product_detail_id;
    }

    static validate(data) {
        const schema = Joi.object({
            cart_id: Joi.number().integer().required(),
            product_detail_id: Joi.number().integer().required(),
            quantity: Joi.number().integer().min(1).required()
        });

        return schema.validate(data); // Returns { error, value }
    }
}

export default InsertCartItemRequest;
