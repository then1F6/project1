import http from "./http_client";
import type { post } from "../global_types";
/** 
 * @typedef {Object} Post
 * @property {number} id
 * @property {string} author_nick
 * @property {string} author_color
 * @property {string} content
 * @property {number} created_at
 * @property {number} likes_count
 * @property {number} bookmarks_count
 * @property {number} comments_count
 * 
*/


export async function get_all_posts() {
  const data: post[] = await http.get("/post/get_all", {}, false);
  return data
}

export async function get_liked_by(profile_nick: string) {
  const data: post[] = await http.get(`/post/likeds_by/${profile_nick}`, {}, false);
  return data
}
export async function get_bookmarked_by(profile_nick: string) {
  const data: post[]  = await http.get(`/post/bookmarkeds_by/${profile_nick}`, {}, false);
  return data
}
export async function get_created_by(profile_nick: string) {
  const data: post[]  = await http.get(`/post/created_by/${profile_nick}`, {}, false);
  return data
}

export async function create_post(content: string) {
  const data = await http.post("/post/create", {
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({content})
  }, true)
  return data
}
export async function delete_post(post_id: number) {
  const data = await http.delete(`/post/delete/${post_id}`, {}, true)
  return data
}


export async function get_my_likes() {
  const data = await http.get("/me/likes", {}, true)
  return data
}
export async function get_my_bookmarks() {
  const data = await http.get("/me/bookmarks", {}, true)
  return data
}

export async function get_my_likes_id() {
  const data: number[] = await http.get("/me/likes/id", {}, true)
  return data
}
export async function get_my_bookmarks_id() {
  const data: number[] = await http.get("/me/bookmarks/id", {}, true)
  return data
}


export async function toggle_like(post_id: number) {
  const data = await http.post(`/post/toggle_like/${post_id}`)
}
export async function toggle_bookmark(post_id: number) {
  const data = await http.post(`/post/toggle_bookmark/${post_id}`)
}

export async function get_my_posts() {
  const data: post[] = await http.get("/me/posts", {}, true)
  return data
}