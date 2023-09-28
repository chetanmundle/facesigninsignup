//create user i.e enter data

import { NextResponse } from "next/server";
import { User } from "../../../models/user";
import { connectDB } from "../../../helper/db";

connectDB();

export async function POST(request: any) {
  const { firstname, lastname, username, password, img1, img2 } =
    await request.json();

  console.log(username, password, img1, img2);

  const user = new User({
    firstname,
    lastname,
    username,
    password,
    img1,
    img2,
  });

  try {
    const createUser = await user.save();

    const responce = NextResponse.json(user, {
      status: 201,
    });
    console.log("Saved data");
    return responce;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to create user!!",
        status: false,
      },
      {
        status: 500,
      }
    );
  }
}
