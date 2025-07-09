import Joi from 'joi';
import OrderStatus from '../../../constants';
import 'module-alias/register';

class UpdateOrderRequest {
    constructor(data) {
        this.status = data.status;
        this.note = data.note;
        this.total = data.total;
    }

    static validate(data) {
        const schema = Joi.object({
            status: Joi.number()
                .integer()
                .valid(...Object.values(OrderStatus))
                .optional(),
            note: Joi.string().allow(null, '').optional(),
            total: Joi.number().integer().min(0).optional()
        });

        return schema.validate(data);
    }
}

export default UpdateOrderRequest;
