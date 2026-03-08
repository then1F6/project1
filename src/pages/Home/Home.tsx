import { VscAccount, VscThreeBars, VscSettingsGear } from "react-icons/vsc";

import { useState, useEffect, useRef } from "react";

import s from "./home.module.css"
import Profile from "../../components/Profile/Profile"
import PostsPage from "../../components/Posts/Posts"
import Settings from "../../components/Settings/Settings"

import usePosts from "../../hooks/usePosts";
import {
  get_my_profile
} from "../../api/me_api"
import type { profile } from "../../global_types";


export default function Home() {
  useEffect(() => { load() }, [])

  const [myProfile, setMyProfile] = useState<profile | null>(null)

  const [tab, setTab] = useState("posts");
  const changeTab = (page_name: string) => {
    if (page_name === tab) return;
    setTab(page_name)
  }; const [NickOtherProfile, setNickOtherProfile] = useState("")

  async function load() {
    postsLoad()
    const myProfile = await get_my_profile()
    setMyProfile(myProfile)
  }

  const {
    postsLoad,
    posts,
    likes,
    bookmarks,
    nextLoaclID,

    loadPosts,
    loadLikedPosts,
    loadBookmarkedPosts,

    onCreatePost,
    onDeletePost,
    onLike,
    onBookmark
  } = usePosts(myProfile)


  return (<>
<div className={s.home_container}>
  <aside className={s.aside}>
    <button className={s.icons_button} onClick={() => changeTab("posts")}>
      <VscThreeBars className={s.user_acc_icon}/>
    </button>
    <button className={s.icons_button} onClick={() => changeTab("profile")}>
      <VscAccount className={s.user_acc_icon}/>
    </button>
    <button className={s.icons_button} onClick={() => changeTab("settings")}>
      <VscSettingsGear className={s.user_acc_icon}/>
    </button>
  </aside>
  <main className={s.main}>
    {tab === "posts" && <>
    <PostsPage 
      onDeletePost={onDeletePost}
      me={myProfile}
      onOpenOtherProfile={(profile_nick: string) => {
        if (profile_nick === myProfile?.nick) {setTab("profile"); return}
        setTab("other_profile");
        setNickOtherProfile(profile_nick)
      }}
      posts={posts}
      likes={likes}
      bookmarks={bookmarks}
      onLike={onLike}
      onBookmark={onBookmark}
    />
    </>}
    {tab === "profile" && myProfile && <><Profile 
      posts={posts}
      likes={likes}
      bookmarks={bookmarks}

      isMe={true}
      me={myProfile}
      onCreatePost={onCreatePost}
      nextLoaclID={nextLoaclID.current}
      loadPosts={loadPosts}
      loadLiked={loadLikedPosts}
      loadBookmarked={loadBookmarkedPosts}

      onLike={onLike}
      onBookmark={onBookmark}
      onDeletePost={onDeletePost}
      onOpenOtherProfile={(profile_nick: string) => {
        if (profile_nick === myProfile?.nick) {setTab("profile"); return}
        setTab("other_profile");
        setNickOtherProfile(profile_nick)
      }}
    /></>}
    {tab === "other_profile" && myProfile && <><Profile 
      me={myProfile}
      posts={posts}
      likes={likes}
      bookmarks={bookmarks}

      isMe={false}
      other_nick={NickOtherProfile}
      loadPosts={loadPosts}
      loadLiked={loadLikedPosts}
      loadBookmarked={loadBookmarkedPosts}

      onLike={onLike}
      onBookmark={onBookmark}
      onDeletePost={onDeletePost}
      onOpenOtherProfile={(profile_nick: string) => {
        if (profile_nick === myProfile?.nick) {setTab("profile"); return}
        setTab("other_profile");
        setNickOtherProfile(profile_nick)
      }}
    /></>}

    {tab === "settings" && myProfile && <><Settings
      me={myProfile}
    /></>}
  </main>
</div>
  </>)
}