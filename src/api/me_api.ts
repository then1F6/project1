import http from "./http_client";


export async function get_my_profile() {
  const data = await http.get("/me/profile", {}, true);
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

export function toggle_publicity_likes() {
  http.post("me/private/likes")
}
export function toggle_publicity_bookmarks() {
  http.post("me/private/bookmarks")
}