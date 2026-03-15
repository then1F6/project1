import http from "./http_client";
import type { profile, settings } from "../global_types"


interface apiError {
  detail: string
}

export async function get_my_profile() {
  const data: profile | apiError = await http.get("/me/profile", {}, true);
  if ("detail" in data) return null
  return data
}
export async function get_my_followings() {
  const data: string[] | apiError = await http.get("/me/followings", {}, true)
  if ("detail" in data) return [] // превратится в пустой Set()
  return data
}
export async function get_my_settings() {
  const data: settings | apiError = await http.get("/me/settings", {}, true);
  if ("detail" in data) return null
  return data
}



export async function change_bio(new_bio: string) {
  const data = await http.post("/me/change_bio", {
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({new_bio})
  }, true)
  return data
}


export async function toggle_follow(following_nick: string) {
  http.post("/profile/toggle_follow/" + following_nick, {}, true)
}
export async function toggle_publicity_likes() {
  http.post("/me/private/likes", {}, true)
}
export async  function toggle_publicity_bookmarks() {
  http.post("/me/private/bookmarks", {}, true)
}

export async function toggle_settings(settings_parameter: string) {
  http.post(`/me/settings/${settings_parameter}`, {}, true)
}