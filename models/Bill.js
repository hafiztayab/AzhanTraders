const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var billSchema = new Schema({
  billno: {
    type: String,
    trim: true,
    required: true
  },
  billfile: {
    type: String,
    trim: true,
    required: true
  }
});

var Bill = mongoose.model("Bill", billSchema);

module.exports = Bill;
