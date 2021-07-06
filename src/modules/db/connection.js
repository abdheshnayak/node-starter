import mongoose from 'mongoose';
import {readSecret} from "../../config/read-secret";

(async () => {
  try {
    const dbUrl = readSecret('DB_URL');
    await mongoose.connect(dbUrl, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (err) {
    console.log("Database connection error");
  }
})();
