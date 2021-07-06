import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  is_admin: {
    type: Boolean,
    default: false,
  },
});

const adminModel = mongoose.model("admin_record", adminSchema);

export default adminModel;
