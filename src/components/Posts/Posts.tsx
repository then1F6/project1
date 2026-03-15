import { useCallback, useState, useEffect } from "react"

import { usePosts } from "../../contexts/PostsContext"

import s from "./post.module.css"
import PostCard from "../PostCard/PostCard"
import type { profile, settings, post } from "../../global_types"



interface PostsProps {
  me: profile | null
  settings: settings
  onOpenProfile: (profile_nick: string) => void,
}

export default function PostsPage(props: PostsProps) {
  const { me, onOpenProfile, settings } = props

  const { posts, likes, bookmarks, 
    onLike, onBookmark, onDeletePost,
  } = usePosts()
  const handleOpenProfile = useCallback(
    (nick: string) => {onOpenProfile(nick)},
  [])

  const [renderPosts, setRenderPosts] = useState<post[]>([])
  useEffect(() => {
    setRenderPosts(Array.from(posts.values()).reverse())
  }, [posts])

  return (
<div className={s.posts}>
  <section className={settings.two_column_posts ? s.posts_container_two : s.post_container}>

    {renderPosts.map((post) => (
      <PostCard 
        is_me={me?.nick === post.author_nick}
        post_id={post.id}
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
        
        onLike={onLike}
        onBookmark={onBookmark}
        onDeletePost={onDeletePost}
        onClickProfile={handleOpenProfile}
      />
    ))}
  </section>
  <section className={s.comments}>
  </section>
</div>)
}