import mongoose from "mongoose";

export interface processEnv {
  [key: string]: string | undefined;
}

export const connectDB = async () => {
  try {
    const mongoDBUrl = process.env.MONGO_DB_URL || ""; // Provide a default value if undefined
    if (!mongoDBUrl) {
      throw new Error(
        "MONGO_DB_URL is not defined in the environment variables"
      );
    }

    const { connection } = await mongoose.connect(mongoDBUrl, {
      dbName: "codeclause",
    });

    console.log("DB connected");
  } catch (error) {
    console.log("Failed to connect with DB");
    console.error(error);
  }
};
