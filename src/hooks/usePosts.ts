import { useState, useRef } from "react"
import { 
  get_all_posts, get_my_likes_id, get_my_bookmarks_id,
  toggle_like, toggle_bookmark, delete_post, 
  get_created_by, get_liked_by, get_bookmarked_by,
  get_my_likes, get_my_bookmarks,
} from "../api/posts_api";
import type { post, profile } from "../global_types";


export default function usePosts(myProfile: profile | null) {
  async function postsLoad() {
    const [posts, likes_id, bookmarks_id] = await Promise.all([
      get_all_posts(),
      get_my_likes_id(),
      get_my_bookmarks_id()
    ]) 

    setPosts(new Map(posts.map(post => [post.id, post])))
    setLikes(new Set(likes_id))
    setBookmarks(new Set(bookmarks_id))
  }

  const [posts, setPosts] = useState(new Map<number, post>())
  const [likes, setLikes] = useState(new Set<number>())
  const [bookmarks, setBookmarks] = useState(new Set<number>())

  const loadPostsOf = async (nick: string) => {
    const myPosts: post[] = await get_created_by(nick)
    setPosts(prev => {
      const next = new Map(prev)
      const myPostsMap = new Map(myPosts.map(post => [post.id, post]))
      return new Map([...next, ...myPostsMap])
    })
    return myPosts.map(post => post.id)
  }
  const loadLikedPosts = async (nick: string) => {
    const myPosts: post[] | { detail: string } = myProfile?.nick === nick 
    ? (await get_my_likes())
    : (await get_liked_by(nick))

    if ("detail" in myPosts) {
      return []
    }
    setPosts(prev => {
      const next = new Map(prev)
      const myPostsMap = new Map(myPosts.map(post => [post.id, post]))
      return new Map([...next, ...myPostsMap])
    })
    return myPosts.map(post => post.id)
  }
  const loadBookmarkedPosts = async (nick: string) => {
    const myPosts: post[]  | {detail: string} = myProfile?.nick === nick 
    ? (await get_my_bookmarks())
    : (await get_bookmarked_by(nick))
    
    if ("detail" in myPosts) {
      console.log(myPosts)
      return []
    }
    setPosts(prev => {
      const next = new Map(prev)
      const myPostsMap = new Map(myPosts.map(post => [post.id, post]))
      return new Map([...next, ...myPostsMap])
    })
    return myPosts.map(post => post.id)
  }


  let nextLoaclID = useRef(-1)
  const onCreatePost = (content: string) => {
    setPosts(prev => {
      const next = new Map([...prev, [nextLoaclID.current, {
        "id": nextLoaclID.current,
        "author_color": myProfile?.color ?? "",
        "author_nick": myProfile?.nick ?? "",
        "bookmarks_count": 0,
        "comments_count": 0,
        "likes_count": 0,
        "content": content,
        "created_at": Math.floor(Date.now() / 1000)
      }]]);
      nextLoaclID.current -= 1;
      return next
    })
  }
  const onDeletePost = (post_id: number) => {
    setPosts(prev => {
      const next = new Map(prev)
      if (post_id < 0) {
        console.log("can't delete");
        return next
      } else {
        delete_post(post_id)
        next.delete(post_id)
        return next
      }
    })
  }
  const onLike = (post_id: number) => {
    toggle_like(post_id)
    const isLiked = likes.has(post_id)

    setPosts(prev => {
      const next = new Map(prev)
      const post = next.get(post_id)
      if (!post) return next
      next.set(post_id, {...post,
        "likes_count": isLiked ? post.likes_count - 1 : post.likes_count + 1
      })
      return next
    })
    setLikes(prev => {
      const next = new Set(prev)
      if (isLiked) {
        next.delete(post_id)
      } else {
        next.add(post_id)
      }
      return next
    })
  }
  const onBookmark = (post_id: number) => {
    toggle_bookmark(post_id)
    const isBookmarked = bookmarks.has(post_id)

    setPosts(prev => {
      const next = new Map(prev)
      const post = next.get(post_id)
      if (!post) return next
      next.set(post_id, {...post,
        "bookmarks_count": isBookmarked ? post.bookmarks_count - 1 : post.bookmarks_count + 1
      })
      return next
    })
    setBookmarks(prev => {
      const next = new Set(prev)
      if (isBookmarked) {
        next.delete(post_id)
      } else {
        next.add(post_id)
      }
      return next
    })
  }
  return {
    postsLoad,
    posts,
    likes,
    bookmarks,
    nextLoaclID,

    loadPosts: loadPostsOf,
    loadLikedPosts,
    loadBookmarkedPosts,
    
    onCreatePost,
    onDeletePost,
    onLike,
    onBookmark
  }
}