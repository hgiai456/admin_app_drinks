import Joi from "joi";

class InsertNewsDetailRequest {
  constructor(data) {
    this.news_id = data.news_id;
    this.product_id = data.product_id;
  }

  static validate(data) {
    const schema = Joi.object({
      news_id: Joi.number().integer().positive().required(),

      product_id: Joi.number().integer().positive().required(),
    });

    return schema.validate(data, { abortEarly: false });
  }

  // Helper method
  static create(data) {
    const { error, value } = this.validate(data);
    if (error) {
      throw new Error(
        `Validation error: ${error.details.map((d) => d.message).join(", ")}`
      );
    }
    return new InsertNewsDetailRequest(value);
  }
}

export default InsertNewsDetailRequest;
