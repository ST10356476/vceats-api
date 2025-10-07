const { validationResult } = require('express-validator');

/**
 * validate - wrapper middleware to run express-validator checks
 * Usage: pass an array of validation chains from express-validator
 * e.g. router.post('/', validate([ body('name').notEmpty() ]), controller)
 */
const validate = (checks) => async (req, res, next) => {
	try {
		// run validations
		await Promise.all(checks.map(check => check.run(req)));

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({
				success: false,
				errors: errors.array().map(e => ({ param: e.param, msg: e.msg }))
			});
		}

		return next();
	} catch (err) {
		return next(err);
	}
};

module.exports = { validate };
