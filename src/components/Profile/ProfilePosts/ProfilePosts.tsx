import { useState, useEffect } from "react"

import s from "./profile_posts.module.css"
import PostCard from "../../PostCard/PostCard";
import { MdOutlineAddCircleOutline, MdOutlineWest, MdErrorOutline} from "react-icons/md"
import { VscHeart, VscBookmark, VscThreeBars } from "react-icons/vsc";

import { create_post } from "../../../api/posts_api";

import useTimeout from "../../../hooks/useTimeout";

import type { profile, settings } from "../../../global_types"
import { usePosts } from "../../../contexts/PostsContext";
interface Props {
  is_my: boolean
  me: profile | null
  profile: profile | null
  other_nick: string
  settings: settings

  changeProfileLikes: (incr: boolean) => void
  onOpenProfile: (profile_nick: string) => void
}


export default function ProfilePosts (props: Props) {
  const {is_my, me, settings, other_nick, profile,
    onOpenProfile, changeProfileLikes
  } = props;

  const { posts, likes, bookmarks, nextLocalID, 
    onLike, onBookmark, onCreatePost, onDeletePost,
    loadBookmarked, loadLiked, loadPosts
  } = usePosts()

  const onDeleteLoacl = (post_id: number) => {
    onDeletePost(post_id)
    setPostsIDs(prev => prev.filter(id => id !== post_id))
  }
  const onCreateLoacl = () => {
    onCreatePostLoacl()
  }
  const [PostsIDs, setPostsIDs] = useState<number[]>([]);
  const [LikedIDs, setLikedIDs] = useState<number[]>([]);
  const [BookmarkedIDs, setBookmarkedIDs] = useState<number[]>([]);
  
  useEffect(() => {
    async function load() {
      if (is_my && me) {
        const [post_ids, liked_ids, bookmarked_ids]  = await Promise.all([
          loadPosts(me.nick),
          loadLiked(me.nick),
          loadBookmarked(me.nick)
        ]);
        setPostsIDs(post_ids.reverse())
        setBookmarkedIDs(bookmarked_ids.reverse())
        setLikedIDs(liked_ids.reverse())

      } else {
        const [other_posts] = await Promise.all([
          // везде ! так как сверху есть проверка на принадлженость профиля
          loadPosts(other_nick!),,
        ])
        setPostsIDs(other_posts.reverse())
      }
    }
    load()
  }, [])
  useEffect(() => {
    async function loadPrivite() {
      if (is_my) return
      const [liked_ids, bookmarked_ids] = await Promise.all([
        (profile?.is_public_likes ? loadLiked(other_nick!) : []),
        (profile?.is_public_bookmarks ? loadBookmarked(other_nick!): []),
      ])
      setBookmarkedIDs(bookmarked_ids.reverse())
      setLikedIDs(liked_ids.reverse())
    }
    loadPrivite()
  }, [profile])

  const [infoBlock, setInfoBlock] = useState("read")
  const [infoTab, setInfoTab] = useState("posts")

  const [newPostText, setNewPostText] = useState("")
  const [feedback, setFeedback] = useState("")
  const [onCreatePostLoacl, isClicked] = useTimeout(async () => {
    if (newPostText.trim().length > 256) {
      console.log("long post content")
      return
    }
    if (is_my) {
      setPostsIDs(prev => {
        const next = [nextLocalID, ...prev]
        return next
      })
      const data = await onCreatePost(newPostText)
      setPostsIDs(prev => {
        const next = prev.map(id => (id == data.local_id ? data.post_id : id))
        return next
      })
      setFeedback(data.msg);
    }
  }, 500)

  const onLikeLocal = (id: number) => {
    onLike(id)
    if (posts.get(id)?.author_nick !== profile?.nick) return

    if (!likes.has(id)) {
      if (is_my) setLikedIDs(prev => [id, ...prev])
      changeProfileLikes(true)
    } else {
      if (is_my) setLikedIDs(prev => prev.filter(like_id => like_id !== id))
      changeProfileLikes(false)
    }
  }
  const onBookmarkLocal = (id: number) => {
    onBookmark(id)
    if (!is_my) return

    if (!bookmarks.has(id)) {
      setBookmarkedIDs(prev => [id, ...prev])
    } else {
      setBookmarkedIDs(prev => prev.filter(like_id => like_id !== id))
    }
  }

  const renderPosts = (ids: number[]) => {
    return (ids.map(post_id => {
      const post = posts.get(post_id);
      if (!post) return (<div>loading</div>)
      return (<PostCard 
        post_id={post.id}
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
        
        onLike={() => {onLikeLocal(post.id)}}
        onBookmark={() => {onBookmarkLocal(post.id)}}
        onDeletePost={() => {onDeleteLoacl(post.id)}}
        onClickProfile={onOpenProfile}
      />)
    }))
  }


  return (<section className={s.profile_posts}> 
    {infoBlock === "read" && <>
    <header className={s.info_header}>
      <button onClick={() => setInfoTab("posts")} 
      className={infoTab === "posts" ? `${s.button} ${s.selected_info_tab}` : s.button}>
        <VscThreeBars /> <h3> Posts </h3>
      </button>
      <button onClick={() => setInfoTab("likes")} 
      className={infoTab === "likes" ? `${s.button} ${s.selected_info_tab}` : s.button}> 
        <VscHeart /> <h3> Likes </h3>
      </button>
      <button onClick={() => setInfoTab("bookmarks")} 
      className={infoTab === "bookmarks" ? `${s.button} ${s.selected_info_tab}` : s.button}>
        <VscBookmark /> <h3> Bookmarks </h3>
      </button>
      <div></div>
      {is_my && <button className={s.add_button} onClick={() => setInfoBlock("create")}>
        <MdOutlineAddCircleOutline />
      </button>}
    </header>
    <div className={settings?.two_column_posts ? s.info_main : s.info_main_one_column}>
      {infoTab === "posts" && renderPosts(PostsIDs)}
      {infoTab === "likes" && (!is_my ? (profile?.is_public_likes 
      ? renderPosts(LikedIDs)
      : <div className={s.info_error}> <MdErrorOutline /> <h2>User has hidden his likes </h2> </div>)
      : renderPosts(LikedIDs)
      )}
      {infoTab === "bookmarks" && (!is_my ? (profile?.is_public_bookmarks 
      ? renderPosts(BookmarkedIDs)
      : <div className={s.info_error}> <MdErrorOutline /> <h2>User has hidden his bookmarks </h2> </div>)
      : renderPosts(BookmarkedIDs)
      )}
    </div></> }
    {infoBlock === "create" && <>
      <header className={s.info_header_create}>
        <button onClick={() => setInfoBlock("read")}> <MdOutlineWest /></button>
        <h2> Create Post here </h2>
      </header>
      <div className={s.info_main_create}>
        <textarea
          spellCheck="false"
          placeholder="New post text..."
          rows={5}
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          wrap="hard"
        ></textarea>
        <div>
          <p> {isClicked && feedback} </p>
          <button onClick={onCreateLoacl}> Create </button>
        </div>
      </div>
    </>}
    
  </section>)
}