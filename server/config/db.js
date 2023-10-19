import mongoose from 'mongoose';

export const connectDB = async () => {
  const dbUsername = process.env.DB_USERNAME;
  const dbPassword = process.env.DB_PASSWORD;
  const dbHost = process.env.DB_HOST;
  const dbName = process.env.DB_NAME;

  try {
    const dbUrl = `mongodb+srv://${dbUsername}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`;
    const conn = await mongoose.connect(dbUrl, {
      useNewUrlParser: true, // <-- no longer necessary
      useUnifiedTopology: true, // <-- no longer necessary
    });
    console.log(`mongodb connected : ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

export default connectDB;
