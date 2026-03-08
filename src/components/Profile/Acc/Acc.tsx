import { useState, useEffect } from "react";
import { PiPencilSimpleBold } from "react-icons/pi";

import parseTimeAgo from "../../../utils/parseTimeAgo";
import useTimeout from "../../../hooks/useTimeout";
import { change_bio } from "../../../api/me_api";

import s from "./acc.module.css"
import type { profile } from "../../../global_types";



interface AccProps {
  profileData: profile | null,
  isMe: boolean,
}

export default function Acc(props: AccProps) {
  const {profileData, isMe} = props;

  const [profileBio, setProfileBio] = useState(profileData?.bio || "")
  const [profileBioState, setProfileBioState] = useState("read")
  useEffect(() => {
    if (profileData?.bio) {
      setProfileBio(profileData.bio);
    }
  }, [profileData]);
  const [onChangeBio, isClicked] = useTimeout(() => {
    change_bio(profileBio)
  }, 0)

  return (<>
<section className={s.profile_acc}> 
  <header>
    <div style={{ backgroundColor: profileData?.color }}> </div>
    <h3> {profileData?.nick} </h3>
  </header>
  <div className={s.acc_info}>
    <div> <h3>Followers</h3> {profileData?.followers_count} </div>
    <div> <h3>Followings</h3> {profileData?.followings_count}</div>
    <div> <h3>Likes</h3> {profileData?.likes_count } </div>
  </div>
  <div className={s.acc_bio}>
    {profileBioState === "read" && <pre>{ profileBio }</pre>}
    {profileBioState === "write" && <textarea
      spellCheck="false"
      placeholder="New post text..."
      rows={5}
      cols={45}
      value={profileBio}
      onChange={(e) => setProfileBio(e.target.value)}
      wrap="hard"
    ></textarea>}
    {isMe && <button 
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
  <p>{ parseTimeAgo(profileData?.created_at) }</p>
</section>
  </>)
}