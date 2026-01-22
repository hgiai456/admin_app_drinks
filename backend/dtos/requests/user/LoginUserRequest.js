import Joi from "joi";

class LoginUserRequest {
  constructor(data) {
    this.email = data.email;
    this.password = data.password;
    this.phone = data.phone || null;
  }

  static validate(data) {
    const schema = Joi.object({
      email: Joi.string().email().optional(),
      password: Joi.string().min(6).required(), // Đảm bảo phải gọi mã hoá trước khi lưu!
      phone: Joi.string()
        .pattern(/^(0|\+84)[0-9]{9,10}$/)
        .optional()
        .allow(null, ""),
    });

    return schema.validate(data);
  }
}

export default LoginUserRequest;
