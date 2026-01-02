import Joi from "joi";

class InsertNewsRequest {
  constructor(data) {
    this.title = data.title;
    this.image = data.image;
    this.content = data.content;
    this.product_ids = data.product_ids;
  }

  static validate(data) {
    const schema = Joi.object({
      title: Joi.string().min(5).max(255).required(),

      image: Joi.string().uri().optional().allow(null, ""),

      content: Joi.string().min(20).required(),

      product_ids: Joi.array()
        .items(Joi.number().integer().positive())
        .optional(),
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
    return new InsertNewsRequest(value);
  }
}

export default InsertNewsRequest;
