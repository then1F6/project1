import { useState, useEffect, useRef, useContext, createContext, type ReactNode,
  useCallback,
  useMemo,
} from "react"
import { 
  get_all_posts, get_my_likes_id, get_my_bookmarks_id,
  toggle_like, toggle_bookmark, delete_post, 
  get_created_by, get_liked_by, get_bookmarked_by,
  get_my_likes, get_my_bookmarks,
  create_post,
} from "../api/posts_api";
import type { post, profile } from "../global_types"

interface PostsContextType {
  posts: Map<number, post>;
  likes: Set<number>;
  bookmarks: Set<number>;
  nextLocalID: number;

  loadPosts: (nick: string) => Promise<number[]>;
  loadLiked: (nick: string) => Promise<number[]>;
  loadBookmarked: (nick: string) => Promise<number[]>;

  onCreatePost: (content: string,) => Promise<{
    ok: boolean, msg: string, post_id: number, local_id: number,
  }>;
  onDeletePost: (post_id: number) => void;
  onLike: (post_id: number) => void;
  onBookmark: (post_id: number) => void;
}
const Context = createContext<PostsContextType | null>(null)


export function PostsProvider(props: { children: ReactNode, my_profile: profile | null }) {
  const {children, my_profile } = props
  
  useEffect(() => { 
    async function initialLoad() {
    const [posts, likes_id, bookmarks_id] = await Promise.all([
      get_all_posts(),
      get_my_likes_id(),
      get_my_bookmarks_id()
    ]) 
    setPosts(new Map(posts.map(post => [post.id, post])))
    setLikes(new Set(likes_id))
    setBookmarks(new Set(bookmarks_id))
    }
    initialLoad() 
  }, [])

  const [posts, setPosts] = useState(new Map<number, post>())
  const [likes, setLikes] = useState(new Set<number>())
  const [bookmarks, setBookmarks] = useState(new Set<number>())

  const loadPosts = useCallback(async (nick: string) => {
    const posts: post[]  | {detail: string} = await get_created_by(nick)
    if ("detail" in posts) {
      return []
    }
    setPosts(prev => {
      const next = new Map(prev)
      posts.forEach(post => next.set(post.id, post))
      return next
    })
    return posts.map(post => post.id)
  }, [])
  const loadLiked = useCallback(async (nick: string) => {
    const likedPosts: post[] | { detail: string } = my_profile?.nick === nick 
    ? (await get_my_likes())
    : (await get_liked_by(nick))

    if ("detail" in likedPosts) {
      return []
    }
    setPosts(prev => {
      const next = new Map(prev)
      likedPosts.forEach(post => next.set(post.id, post))
      return next
    })
    return likedPosts.map(post => post.id)
  }, [my_profile?.nick])
  const loadBookmarked = useCallback(async (nick: string) => {
    const bookmarkedPosts: post[] | {detail: string} = my_profile?.nick === nick 
    ? (await get_my_bookmarks())
    : (await get_bookmarked_by(nick))
    
    if ("detail" in bookmarkedPosts) {
      return []
    }
    setPosts(prev => {
      const next = new Map(prev)
      bookmarkedPosts.forEach(post => next.set(post.id, post))
      return next
    })
    return bookmarkedPosts.map(post => post.id)
  }, [my_profile?.nick])


  let nextLocalID = useRef(-1)
  const onCreatePost = useCallback(async (content: string) => {
    setPosts(prev => {
      const next = new Map([...prev, [nextLocalID.current, {
        "id": nextLocalID.current,
        "author_color": my_profile?.color ?? "",
        "author_nick": my_profile?.nick ?? "",
        "bookmarks_count": 0,
        "comments_count": 0,
        "likes_count": 0,
        "content": content,
        "created_at": Math.floor(Date.now() / 1000)
      }]]);
      return next
    })
    const data = await create_post(content, nextLocalID.current);
    setPosts(prev => {
      const next = new Map(prev)
      const post = next.get(data.local_id)
      if (!post) return next
      next.delete(data.local_id)
      next.set(data.post_id, {...post, "id": data.post_id})
      return next
    })
    nextLocalID.current -= 1;
    return data
  }, [my_profile?.color, my_profile?.nick])
  const onDeletePost = useCallback((post_id: number) => {
    if (post_id < 0) {
      console.log("can't delete")
      return
    }
    delete_post(post_id)
    setPosts(prev => {
      const next = new Map(prev)
      next.delete(post_id)
      return next
    })
  }, [])
  const onLike = useCallback((post_id: number) => {
    toggle_like(post_id)
    setLikes(prev => {
      const next = new Set(prev)
      const isLiked = next.has(post_id)
      if (!isLiked) {
        next.add(post_id)
      } else {
        next.delete(post_id)
      }
      setPosts(prev => {
        const next = new Map(prev)
        const post = next.get(post_id)
        if (!post) return next
        next.set(post_id, {...post,
          "likes_count": isLiked ? post.likes_count - 1 : post.likes_count + 1
        })
        return next 
      })
      return next
    })
  }, [])
  const onBookmark = useCallback((post_id: number) => {
    toggle_bookmark(post_id)
    setBookmarks(prev => {
      const next = new Set(prev)
      const isBookmarked = next.has(post_id)
      if (!isBookmarked) {
        next.add(post_id)
      } else {
        next.delete(post_id)
      }
      setPosts(prev => {
        const next = new Map(prev)
        const post = next.get(post_id)
        if (!post) return next
        next.set(post_id, {...post,
          "bookmarks_count": isBookmarked ? post.bookmarks_count - 1 : post.bookmarks_count + 1
        })
        return next
      })
      return next
    })
  }, [])

  const value = useMemo(() => ({
    posts, likes, bookmarks, nextLocalID: nextLocalID.current,
    loadLiked, loadBookmarked, loadPosts, 
    onCreatePost, onDeletePost, onLike, onBookmark
  }), [ 
    posts, likes, bookmarks,
    loadLiked, loadBookmarked, loadPosts, 
    onCreatePost, onDeletePost, onLike, onBookmark
  ])

  return (<Context.Provider value={value}>
    {children}
  </Context.Provider>)
}


export function usePosts() {
  const context = useContext(Context)
  if (!context) {
    throw new Error("usePosts may be used only in PostsProviders")
  }; 
  return context
}