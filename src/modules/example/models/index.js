import mongoose from "mongoose";

const exampleSchema = mongoose.Schema({
  name: String,
  email: { type: String },
});

export default mongoose.model("example_record", exampleSchema);
