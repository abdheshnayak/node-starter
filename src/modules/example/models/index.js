import mongoose from "mongoose";

const exampleSchema = mongoose.Schema({
  name: String,
  email: { type: String },
});

const exampleModel = mongoose.model("example_record", exampleSchema);
export default exampleModel;
