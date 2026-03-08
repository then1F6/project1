import s from "./post.module.css"

import {PostCard} from "../PostCard/PostCard"
import type { post, profile } from "../../global_types"

interface PostsProps {
  me: profile | null,
  posts: Map<number, post>,
  likes: Set<number>,
  bookmarks: Set<number>,
  onLike: (id: number) => void,
  onBookmark: (id: number) => void,
  onOpenOtherProfile: (profile_nick: string) => void,
  onDeletePost: (post_id: number) => void
}

export default function PostsPage(props: PostsProps) {
  const {
    me, 
    posts,
    likes, 
    bookmarks, 
    onLike, 
    onBookmark, 
    onOpenOtherProfile,
    onDeletePost
  } = props;

  return (
<div className={s.posts}>
  <section className={s.posts_container}>

    {Array.from(posts.values()).reverse().map((post) => (
      <PostCard 
        is_me={me?.nick === post.author_nick}
        key={post.id}
        author_color={post.author_color}
        author_nick={post.author_nick}
        post_content={post.content}

        likes_count={post.likes_count}
        bookmarks_count={post.bookmarks_count}
        comments_count={post.comments_count}
        is_liked={likes.has(post.id)}
        is_bookmarked={bookmarks.has(post.id)}
        is_local={post.id < 0}
        
        onLike={() => {onLike(post.id)}}
        onBookmark={() => {onBookmark(post.id)}}
        onDeletePost={() => {onDeletePost(post.id)}}
        onClickProfile={onOpenOtherProfile}
      />
    ))}
  </section>
</div>)
}