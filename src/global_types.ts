export interface profile {
  nick: string,
  bio: string,
  color: string,

  followers_count: number,
  followings_count: number,
  likes_count: number,
  is_public_likes: boolean,
  is_public_bookmarks: boolean,

  created_at: number,
}
export interface ready_follow {
  nick: string,
  color: string,
}
export interface post {
  id: number,
  author_nick: string,
  author_color: string,
  content: string,
  created_at: number,

  likes_count: number,
  bookmarks_count: number,
  comments_count: number,
}

export interface settings {
  two_column_posts: boolean,
}