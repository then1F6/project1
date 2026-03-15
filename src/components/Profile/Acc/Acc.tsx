import { useState, useEffect } from "react";
import s from "./acc.module.css"

import { PiPencilSimpleBold } from "react-icons/pi";
import { MdOutlineWest } from "react-icons/md";

import parseTimeAgo from "../../../utils/parseTimeAgo";
import useTimeout from "../../../hooks/useTimeout";
import { change_bio } from "../../../api/me_api";
import { get_followers, get_followings } from "../../../api/profile_api";

import type { profile, ready_follow } from "../../../global_types";



interface AccProps {
  profileData: profile | null,
  is_me: boolean,
  me: profile | null
  is_followed: boolean,

  onFollow: () => void
  onOpenProfile: (nick: string) => void
} 

export default function Acc(props: AccProps) {
  const {profileData, is_me, me, is_followed, onFollow, onOpenProfile} = props;

  const [profileBio, setProfileBio] = useState(profileData?.bio || "")
  const [profileFCount, setProfileFCount] = useState(profileData?.followers_count || 0)
  const [profileBioState, setProfileBioState] = useState("read")


  const [followers, setFollowers] = useState<ready_follow[]>([])
  const [followings, setFollowings] = useState<ready_follow[]>([])
  const load = async () => {
    if (!profileData) return

    const [followers, followings] = await Promise.all([
      get_followers(profileData.nick),
      get_followings(profileData.nick)
    ]);
    setFollowers([...followers].reverse())
    setFollowings([...followings].reverse())
  }



  useEffect(() => {
    load()
    if (profileData?.bio) {
      setProfileBio(profileData.bio);
    }
    if (profileData?.followers_count) {
      setProfileFCount(profileData.followers_count)
    }
  }, [profileData]);

  const [onChangeBio, isClicked] = useTimeout(() => {
    change_bio(profileBio)
  }, 0);

  const [tab, setTab] = useState("profile")

  const onFollowLocal = () => {
    if (!me) return
    onFollow()
    if (is_followed) {
      setProfileFCount(prev => prev - 1)
      setFollowers(prev => (
        prev.filter(follow => follow.nick !== me.nick)
      ))
    } else {
      setProfileFCount(prev => prev + 1)
      setFollowers(prev => [{nick: me.nick, color: me.color}, ...prev])
    }
  }


  return (<>
<section className={s.profile_acc}> 
  {tab === "profile" && <><header className={s.profile_header}>
    <div className={s.profile_color} style={{ backgroundColor: profileData?.color }}> </div>
    <h3 className={Number(profileData?.nick?.length) <= 8 ? s.nick : s.nick_long}> {profileData?.nick} </h3>
    {!is_me && <div className={is_followed ? s.follow_button  : `${s.follow_button} ${s.followed}`}>
      <button onClick={onFollowLocal}> {is_followed ? "Unfollow" : "Follow"} </button>
    </div>}
  </header>
  <div className={s.acc_info}>
    <div> 
      <button className="button_wrapper"  onClick={() => setTab("followers")}><h3>Followers</h3> </button> 
      {profileFCount} 
    </div>
    <div> 
      <button className="button_wrapper"  onClick={() => setTab("followings")}><h3>Followings</h3> </button>
      {profileData?.followings_count}</div>
    <div> 
      <h3>Likes</h3> 
      {profileData?.likes_count } </div>
  </div>
  <div className={s.acc_bio}>
    {profileBioState === "read" && <p>{ profileBio }</p>}
    {profileBioState === "write" && <textarea
      spellCheck="false"
      placeholder="New post text..."
      rows={5}
      cols={45}
      value={profileBio}
      onChange={(e) => setProfileBio(e.target.value)}
      wrap="hard"
    ></textarea>}
    {is_me && <button 
      onClick={() => {
        setProfileBioState(prev => {
          if (prev === "read") {
            return "write"
          } else {
            onChangeBio()
            return "read"
          }
        })
    }}> 
      <PiPencilSimpleBold /> 
    </button>}
  </div>
  <p>{ parseTimeAgo(profileData?.created_at) }</p> </>}

  {tab === "followers" && <>
    <header className={s.follows_header}>
      <button onClick={() => setTab("profile")}><MdOutlineWest /></button>
      <h2>Followers</h2>
    </header>
    <div className={s.follows_main}>
      {followers.map(follow => (
        <div className={s.follow_card} key={follow.nick}>
          <div className={s.follow_color} style={{
            backgroundColor: follow.color, backgroundImage: 'none'}}></div>
          <h4><button onClick={() => onOpenProfile(follow.nick)}> {follow.nick} </button></h4> 
        </div>
      ))}
    </div>
  </>}
  {tab === "followings" && <>
    <header className={s.follows_header}>
      <button onClick={() => setTab("profile")}><MdOutlineWest /></button>
      <h2>Followings</h2>
    </header>
    <div className={s.follows_main}>
      {followings.map(follow => (
        <div className={s.follow_card} key={follow.nick}>
          <div className={s.follow_color} style={{
            backgroundColor: follow.color, backgroundImage: 'none'}}></div>
          <h4><button onClick={() => onOpenProfile(follow.nick)}> {follow.nick} </button></h4> 
        </div>
      ))}
    </div>
  </>}
</section>
  </>)
}