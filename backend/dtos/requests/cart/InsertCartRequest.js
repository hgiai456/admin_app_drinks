import Joi from 'joi';

class InsertCartRequest {
    constructor(data) {
        this.user_id = data.user_id; // Image is optional
        this.session_id = data.session_id;
    }

    static validate(data) {
        const schema = Joi.object({
            user_id: Joi.number().integer().optional(),
            session_id: Joi.string().optional().allow('')
        });

        return schema.validate(data); // Returns { error, value }
    }
}

export default InsertCartRequest;
