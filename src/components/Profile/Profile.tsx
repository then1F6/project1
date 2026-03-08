import { useState, useEffect } from "react";

import { MdOutlineAddCircleOutline, MdOutlineWest, MdErrorOutline} from "react-icons/md"
import { VscHeart, VscBookmark, VscThreeBars } from "react-icons/vsc";

import { create_post } from "../../api/posts_api";
import { get_profile } from "../../api/profile_api";

import useTimeout from "../../hooks/useTimeout";
import s from "./profile.module.css"

import Acc from "./Acc/Acc.jsx"
import type { post, profile } from "../../global_types";
import { PostCard } from "../PostCard/PostCard";



interface Base {
  me: profile,

  posts: Map<number, post>,
  likes: Set<number>,
  bookmarks: Set<number>,
  onLike: (id: number) => void,
  onBookmark: (id: number) => void,
  onOpenOtherProfile: (profile_nick: string) => void,
  onDeletePost: (post_id: number) => void,
  
  loadPosts: (nick: string) => Promise<number[]>,
  loadLiked: (nick: string) => Promise<number[]>,
  loadBookmarked: (nick: string) => Promise<number[]>
}
interface MyProfile extends Base{
  isMe: true,
  onCreatePost: (content: string) => void,
  nextLoaclID: number,
  other_nick?: never
}
interface OtherProfile extends Base {
  isMe: false,
  onCreatePost?: never,
  nextLoaclID?: never,
  other_nick: string
}

type ProfileProps = MyProfile | OtherProfile

export default function Profile(props: ProfileProps) {
  const {  posts, likes, bookmarks, 
    onLike, onBookmark, onOpenOtherProfile, onDeletePost, 
    loadPosts, loadLiked, loadBookmarked,
    isMe, 
    me, nextLoaclID, onCreatePost, 
    other_nick, 
    
  } = props;
  const onDeleteLoacl = (post_id: number) => {
    onDeletePost(post_id)
    setPostsIDs(prev => prev.filter(id => id !== post_id))
  }
  const onCreateLoacl = () => {
    onCreatePostLoacl()
    setPostsIDs(prev => {
      const next = [...prev, nextLoaclID!]
      return next
    })
  }

  const [profileData, setProfileData] = useState<profile | null >(null);
  const [PostsIDs, setPostsIDs] = useState<number[]>([]);
  const [LikedIDs, setLikedIDs] = useState<number[]>([]);
  const [BookmarkedIDs, setBookmarkedIDs] = useState<number[]>([]);
  
  useEffect(() => {
    async function load() {
      if (isMe) {
        setProfileData(me)
        const [post_ids, liked_ids, bookmarked_ids]  = await Promise.all([
          loadPosts(me.nick),
          loadLiked(me.nick),
          loadBookmarked(me.nick)
        ])
        console.log(bookmarked_ids)

        setPostsIDs(post_ids.reverse())
        setBookmarkedIDs(bookmarked_ids.reverse())
        setLikedIDs(liked_ids.reverse())
        return
      };

      const [other_profile, other_posts, liked_ids, bookmarked_ids] = await Promise.all([
        get_profile(other_nick),
        loadPosts(other_nick),
        loadLiked(other_nick),
        loadBookmarked(other_nick),
      ]) 
      setProfileData(other_profile);
      setPostsIDs(other_posts.reverse())
      setBookmarkedIDs(bookmarked_ids.reverse())
      setLikedIDs(liked_ids.reverse())
    }
    load()
  }, [])


  const [infoBlock, setInfoBlock] = useState("read")
  const [infoTab, setInfoTab] = useState("posts")

  const [newPostText, setNewPostText] = useState("")
  const [feedback, setFeedback] = useState("")
  const [onCreatePostLoacl, isClicked] = useTimeout(async () => {
    if (newPostText.length > 256) {
      console.log("long post content")
      return
    }
    if (isMe) {
      onCreatePost(newPostText)
      const data = await create_post(newPostText)
      setFeedback(data.msg);
    }
  }, 5000)

  const onLikeLocal = (id: number) => {
    onLike(id)
    if (!likes.has(id)) {
      setLikedIDs(prev => [id, ...prev])
    } else {
      setLikedIDs(prev => prev.filter(like_id => like_id !== id))
    }
  }
  const onBookmarkLocal = (id: number) => {
    onBookmark(id)
    if (!bookmarks.has(id)) {
    setBookmarkedIDs(prev => [id, ...prev])
    } else {
      setBookmarkedIDs(prev => prev.filter(like_id => like_id !== id))
    }
  }

  
  return (
<div className={s.profile}>
  <section className={s.profile_info}> 
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
      {isMe && <button className={s.add_button} onClick={() => setInfoBlock("create")}>
        <MdOutlineAddCircleOutline />
      </button>}
    </header>
    <div className={s.info_main}>
      {infoTab === "posts" && [...PostsIDs].map(post_id => {
        const post = posts.get(post_id);
        if (!post) return (<div>loading</div>)
        return (<PostCard 
          is_me={isMe}
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
          onClickProfile={onOpenOtherProfile}
        />)
      })}

      {infoTab === "likes" && (!isMe ? (profileData?.is_public_likes 
      ? [...LikedIDs].map(post_id => {
        const post = posts.get(post_id);
        if (!post) return (<div>loading</div>)
        return (<PostCard 
          is_me={me.nick === post.author_nick}
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
          onClickProfile={onOpenOtherProfile}
        />)
      })
      : <div className={s.info_error}> <MdErrorOutline /> <h2>User has hidden his likes </h2> </div>)
      : [...LikedIDs].map(post_id => {
        const post = posts.get(post_id);
        if (!post) return (<div>loading</div>)
        return (<PostCard 
          is_me={me.nick === post.author_nick}
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
          onClickProfile={onOpenOtherProfile}
        />)
      })
    )}
      {infoTab === "bookmarks" && (!isMe ? (profileData?.is_public_bookmarks 
      ? [...BookmarkedIDs].map(post_id => {
        const post = posts.get(post_id);
        if (!post) return (<div>loading</div>)
        return (<PostCard 
          is_me={me.nick === post.author_nick}
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
          onClickProfile={onOpenOtherProfile}
        />)
      }) 
      : <div className={s.info_error}> <MdErrorOutline /> <h2>User has hidden his bookmarks </h2> </div>)
      : [...BookmarkedIDs].map(post_id => {
        const post = posts.get(post_id);
        if (!post) return (<div>loading</div>)
        return (<PostCard 
          is_me={me.nick === post.author_nick}
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
          onClickProfile={onOpenOtherProfile}
        />)
      }) 
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
    
  </section>

  <Acc profileData={profileData} isMe={isMe}/>  
</div> 
)
}