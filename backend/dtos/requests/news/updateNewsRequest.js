import Joi from "joi";

class UpdateNewsRequest {
  constructor(data) {
    this.title = data.title;
    this.image = data.image;
    this.content = data.content;
  }

  // Các field có thể null hoặc không gửi,
  // nhưng nếu có thì phải validate
  static validate(data) {
    const schema = Joi.object({
      title: Joi.string().min(5).max(255).optional().allow(null, ""),

      image: Joi.string().uri().optional().allow(null, ""),

      content: Joi.string().min(20).optional().allow(null, ""),
    })
      // Bắt buộc phải có ít nhất 1 field để update
      .min(1);

    return schema.validate(data, { abortEarly: false });
  }
}

export default UpdateNewsRequest;
