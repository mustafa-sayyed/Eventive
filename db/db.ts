import mongoose from "mongoose";

let mongooseCachedConn = mongoose || null;

export async function connectDB() {
  if (mongooseCachedConn) {
    return mongooseCachedConn;
  }

  try {
    mongooseCachedConn = await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log(`DB Connected Successfully: ${mongooseCachedConn.connection.host}`)
  } catch (error) {
    console.error("DB Connection failed: ", error);
  }
}
