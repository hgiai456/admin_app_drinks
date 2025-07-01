import Joi from 'joi';

class InsertProDetailRequest {
    constructor(data) {
        this.name = data.name;
        this.product_id = data.product_id;
        this.size_id = data.size_id;
        this.store_id = data.store_id;
        this.buyturn = data.buyturn || 0;
        this.specification = data.specification;
        this.price = data.price;
        this.oldprice = data.oldprice;
        this.quantity = data.quantity;
        this.img1 = data.img1;
        this.img2 = data.img2;
        this.img3 = data.img3;
    }

    static validate(data) {
        const schema = Joi.object({
            name: Joi.string().required(),
            product_id: Joi.number().integer().min(1).required(),
            size_id: Joi.number().integer().min(1).required(),
            store_id: Joi.number().integer().min(1).required(),
            buyturn: Joi.number().integer().min(0).default(0),
            specification: Joi.string(),
            price: Joi.number().integer().min(0).required(),
            oldprice: Joi.number().integer().min(0).allow(null),
            quantity: Joi.number().integer().min(0).required(),
            img1: Joi.string().allow(''),
            img2: Joi.string().allow(''),
            img3: Joi.string().allow('')
        });
        return schema.validate(data);
    }
}

export default InsertProDetailRequest;
