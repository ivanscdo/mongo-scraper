var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SalesFlyerSchema = new Schema({

  itemName: {
    type: String,
    required: true
  },
  salePrice: {
    type: String,
    required: true
  },
  regPrice: {
    type: String,
    required: true
  },
  validDates: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var SalesFlyer = mongoose.model("SalesFlyer", SalesFlyerSchema);

module.exports = SalesFlyer;
