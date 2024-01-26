const cfg = require('./' + process.env.NODE_ENV || 'development');

export default cfg.default;