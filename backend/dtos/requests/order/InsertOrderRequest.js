import Joi from 'joi';

class InsertOrderRequest {
    constructor(data) {
        this.user_id = data.user_id;
        this.status = data.status;
        this.note = data.note;
        this.total = data.total;
        this.address = data.address;
        this.phone = data.phone;
        // createdAt and updatedAt will be handled by the database
    }

    static validate(data) {
        const schema = Joi.object({
            user_id: Joi.number().integer(),
            status: Joi.number().integer().min(1).required(),
            note: Joi.string().allow('').optional(),
            total: Joi.number().precision(2).min(0).required(),
            address: Joi.string().min(10).max(500).required(),
            phone: Joi.string()
                .pattern(/^(0|\+84)[0-9]{9,10}$/)
                .required()
        });

        return schema.validate(data);
    }

    // Helper method to get validated data
    static create(data) {
        const { error, value } = this.validate(data);
        if (error) {
            throw new Error(`Validation error: ${error.details[0].message}`);
        }
        return new InsertOrderRequest(value);
    }
}

export default InsertOrderRequest;
