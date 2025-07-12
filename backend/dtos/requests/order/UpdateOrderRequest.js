import Joi from 'joi';
import { OrderStatus } from '../../../constants'; // chú ý dùng đúng kiểu export
class UpdateOrderRequest {
    constructor(data) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.status = data.status;
        this.note = data.note;
        this.total = data.total;
        this.address = data.address;
        this.phone = data.phone;
        // updatedAt will be handled by the database
    }

    static validate(data) {
        const schema = Joi.object({
            status: Joi.number().integer().optional(),
            note: Joi.string().allow('').optional(),
            total: Joi.number().precision(2).min(0).optional(),
            address: Joi.string().min(10).max(500).optional(),
            phone: Joi.string()
                .pattern(/^(0|\+84)[0-9]{9,10}$/)
                .optional()
        });

        return schema.validate(data);
    }
}
export default UpdateOrderRequest;
