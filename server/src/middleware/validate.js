const { validationResult } = require('express-validator');

function runValidators(validators) {
  return async (req, res, next) => {
    for (const v of validators) {
      // eslint-disable-next-line no-await-in-loop
      await v.run(req);
    }
    const result = validationResult(req);
    if (result.isEmpty()) return next();
    const first = result.array({ onlyFirstError: true })[0];
    return res.status(400).json({ error: first.msg, field: first.path });
  };
}

module.exports = { runValidators };
