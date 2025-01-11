
var db = require("./db");
var otpEmailSchema = new db.mongoose.Schema(
  {
    Email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresat: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
  { collection: "otpEmail" }
);

otpEmailSchema.index({ expiresat: 1 }, { expireAfterSeconds: 0 });

let otpEmailModel = db.mongoose.model("otpEmailModel", otpEmailSchema);

module.exports = { otpEmailModel };
