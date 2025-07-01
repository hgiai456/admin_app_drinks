import Joi from 'joi';

class InsertUserRequest {
    constructor(data) {
        this.email = data.email;
        this.password = data.password;
        this.name = data.name;
        this.role = data.role;
        this.avatar = data.avatar || null;
        this.phone = data.phone || null;
    }

    static validate(data) {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(), // Đảm bảo phải gọi mã hoá trước khi lưu!
            name: Joi.string().min(2).max(100).required(),
            role: Joi.number().integer().min(1).required(),
            avatar: Joi.string().uri().optional().allow(null, ''),
            address: Joi.string().optional().allow(null, ''),
            phone: Joi.string()
                .pattern(/^(0|\+84)[0-9]{9,10}$/)
                .optional()
                .allow(null, '')
        });

        return schema.validate(data);
    }
}

export default InsertUserRequest;
