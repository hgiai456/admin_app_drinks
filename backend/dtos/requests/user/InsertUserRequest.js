import Joi from 'joi';

class InsertUserRequest {
    constructor(data) {
        this.email = data.email;
        this.password = data.password;
        this.name = data.name;
        this.avatar = data.avatar;
        this.phone = data.phone;
        this.address = data.address;
    }

    static validate(data) {
        const schema = Joi.object({
            email: Joi.string().email().optional(),
            password: Joi.string().min(6).optional(), // Đảm bảo phải gọi mã hoá trước khi lưu!
            name: Joi.string().required(),
            avatar: Joi.string().uri().allow('').optional(),
            phone: Joi.string().optional(),
            address: Joi.string().optional()
        });

        return schema.validate(data);
    }
}

export default InsertUserRequest;
