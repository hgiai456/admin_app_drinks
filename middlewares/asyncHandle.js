const asyncHandle = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            return res.status(500).json({
                message: 'Internal Server Error',
                errors:
                    process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    };
};
export default asyncHandle;
