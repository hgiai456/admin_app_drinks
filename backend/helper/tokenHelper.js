import jwt from 'jsonwebtoken';
import db from '../models'; // Đảm bảo file model là dạng ES6 (export default)
const JWT_SECRET = process.env.JWT_SECRET;

// Hàm kiểm tra và lấy thông tin người dùng từ token
async function getUserFromToken(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res
                .status(401)
                .json({ message: 'Không có token được cung cấp' });
        }

        // Giải mã token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Lấy user từ DB
        const user = await db.User.findByPk(decoded.id); // Sequelize dùng findByPk
        if (!user) {
            return res
                .status(404)
                .json({ message: 'Người dùng không tồn tại' });
        }
        return user; // Trả về user nếu hợp lệ
    } catch (error) {
        // Token sai hoặc hết hạn
        res.status(401).json({
            message: 'Token không hợp lệ hoặc đã hết hạn',
            error: error.message
        });
        return null;
    }
}

export { getUserFromToken };
