const url = "https://api.mojang.com/users/profiles/minecraft/";
import fetch from "node-fetch";

export default async function usernameToUUID(username: string) {
  try {
    let response = (await fetch(`${url}${username}`, {
      method: "GET",
    })) as any;
    let json = await response.json();

    return json;
  } catch (error: any) {
    throw new Error(error);
  }
}
