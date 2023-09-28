// import { httpAxios } from "@/helper/httpHelper";
import { httpAxios } from "../helper/httpHelper";

export async function signUp(user: any) {
  //call api

  const result = await httpAxios
    .post("/api/signup", user)
    .then((responce) => responce.data);
  return result;
}

//login api

export async function login(loginData: any) {
  const result = await httpAxios
    .post("/api/login", loginData)
    .then((response) => response.data);

  return result;
}
