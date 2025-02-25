import mongoose, { CompileModelOptions, ConnectOptions, Schema as Schem } from "mongoose";

export const connect = async ({ uri, options }: {
  uri: string;
  options?: ConnectOptions;
}) => {
  mongoose.connect(uri, options);
};

export const model = <T extends Schem,>(name: string, schema?: T, collection?: string, options?: CompileModelOptions) => {
  const mObject = mongoose.model(name, schema, collection, options);


  const insert = async<T>(data: T) => {
    const result = new mObject(data);
    return result.save();
  }

  return {
    insert,
  }
}

export const schema = <T extends { [key: string]: any; },>(schema: T) => {

  const k = {
    title: String, // String is shorthand for {type: String}
    author: String,
    body: String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
      votes: Number,
      favs: Number
    }
  }
  new Schem({
    name: String
  });
  return new Schem(schema);
}


const mdriver = {
  connect,
  model,
  schema,
};


export default mdriver;
