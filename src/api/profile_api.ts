import http from "./http_client";
import type { profile, ready_follow } from "../global_types";

export async function get_profile(nick: string) {
  const data: Promise<profile> = http.get(`/profile/${nick}`, {}, false)
  return data
}

export async function get_followers(nick: string) {
  const data: Promise<ready_follow[]> = http.get("/profile/followers/" + nick, {}, false)
  return data
}
export async function get_followings(nick: string) {
  const data: Promise<ready_follow[]> = http.get("/profile/followings/" + nick, {}, false)
  return data
}
