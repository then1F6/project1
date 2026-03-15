import { useState, useEffect } from "react";

import { get_profile } from "../../api/profile_api";

import s from "./profile.module.css"

import Acc from "./Acc/Acc.jsx"
import ProfilePosts from "./ProfilePosts/ProfilePosts";
import type { profile, settings } from "../../global_types";


interface Base {
  me: profile | null
  settings: settings

  onOpenProfile: (profile_nick: string) => void,
}
interface MyProfile extends Base{
  is_my: true,
  
  other_nick?: never
  is_followed?: never,
  onFollow?: never
}
interface OtherProfile extends Base {
  is_my: false,

  other_nick: string,
  is_followed: boolean,
  onFollow: () => void
} 


type ProfileProps = MyProfile | OtherProfile

export default function Profile(props: ProfileProps) {
  const { is_my, settings,
    me,
    other_nick, is_followed,
    onOpenProfile, onFollow,
  } = props;

  const [profileData, setProfileData] = useState<profile | null >(null);
  const chageProfileLikes = (incr: boolean) => {
    if (incr) {
      setProfileData(prev => ({
        ...prev!,
        "likes_count": prev!.likes_count + 1
      }))
    } else {
      setProfileData(prev => ({
        ...prev!,
        "likes_count": prev!.likes_count - 1
      }))
    }
  }
  
  useEffect(() => {
    async function load() {
      if (is_my && me) {
        setProfileData(me)
      } else {
        const other_profile = await get_profile(other_nick!)
        setProfileData(other_profile);
      }
    }
    load()
  }, [])
  
  return (
<div className={s.profile}>
  <ProfilePosts 
    is_my={is_my}
    me={me}
    settings={settings}
    profile={profileData}
    other_nick={other_nick || ""}

    changeProfileLikes={chageProfileLikes}
    onOpenProfile={onOpenProfile}
  />

  <Acc profileData={profileData} is_me={is_my} is_followed={!!is_followed} me={me}
    onFollow={onFollow || (() => {})} onOpenProfile={(nick: string) => onOpenProfile(nick)}
  /> 
</div> 
)
}