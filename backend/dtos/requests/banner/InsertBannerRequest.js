import Joi from 'joi';

class InsertBannerRequest {
    constructor(data) {
        this.name = data.name;
        this.image = data.image; // Image is optional
        this.status = data.status;
    }

    static validate(data) {
        const schema = Joi.object({
            name: Joi.string().required(), // Name must be a non-empty string
            image: Joi.string().allow('', null), // Image must be a valid URI, but it is optional
            status: Joi.number().integer().min(1).required() // Status must be an integer greater than 0
        });

        return schema.validate(data); // Returns { error, value }
    }
}

export default InsertBannerRequest;
