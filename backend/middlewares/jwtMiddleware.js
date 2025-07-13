import { getUserFromToken } from '../helper/tokenHelper.js';

const requireRoles = (roleRequired) => async (req, res, next) => {
    const user = await getUserFromToken(req, res);
    if (!user) return;

    if (user.is_locked === 1) {
        return res.status(403).json({ message: 'Tài khoản này đã bị khóa.' });
    }
    if (!roleRequired.includes(user.role)) {
        return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
    req.user = user;
    next();
};
export { requireRoles };
