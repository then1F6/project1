import http from "./http_client.js";
import type { profile } from "../global_types.js";

export async function get_profile(nick: string) {
  const data: Promise<profile> = http.get(`/profile/${nick}`, {}, false)
  return data
}