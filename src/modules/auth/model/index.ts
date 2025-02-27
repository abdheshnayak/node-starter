import mongoose from "mongoose";

import yup from "~/lib/yup";

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  is_admin: {
    type: Boolean,
    default: false,
  },
});

adminSchema.index({ email: 1 }, { unique: true });

export const defaultAdminSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().required(),
  password: yup.string().required(),
  is_admin: yup.boolean().default(false),
});

export const authedUser = yup.object({
  is_admin: yup.boolean().isTrue("Access Denied"),
});

export type IAdmin = yup.InferType<typeof defaultAdminSchema>;

const adminModel = mongoose.model("admin_record", adminSchema);

export default adminModel;
