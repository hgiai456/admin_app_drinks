const validate = (requestType) => {
    return (req, res, next) => {
        const { error } = requestType.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: 'Validation error',
                error: error.details[0].message
            });
        }
        next();
    };
};

export default validate;
