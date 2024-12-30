const mongoose = require('mongoose');

const validatemongodbid = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('this id is not valid or not Found');
  }
};

module.exports = validatemongodbid;
