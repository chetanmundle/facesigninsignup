// import { connectDB } from "@/helper/db";
import { connectDB } from "../../../helper/db";
// import { User } from "@/models/user";
import { User } from "../../../models/user";
import { NextResponse } from "next/server";

connectDB();

export async function POST(request: any) {
  const { username, password, img } = await request.json();

  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      throw new Error("User not found");
    }

    // _id: user._id;
    console.log("This is id");
    const _id = user._id;
    console.log(_id);
    console.log(user);

    const responce = NextResponse.json({
      message: "Login Success!!",
      success: true,
      user: user,
    });

    return responce;
  } catch (error) {}
}
