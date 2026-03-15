import { VscAccount, VscThreeBars, VscSettingsGear } from "react-icons/vsc";
import { IoArrowForward, IoArrowBack } from "react-icons/io5";
import { useState, useEffect, useCallback, useRef } from "react";

import s from "./home.module.css"
import PostsPage from "../../components/Posts/Posts"
import Settings from "../../components/Settings/Settings"
import MyProfile from "../../components/MyProfile/MyProfile";
import OtherProfile from "../../components/OtherProfile/OtherProfile"

import { PostsProvider } from "../../contexts/PostsContext";

import { get_my_profile, get_my_settings, get_my_followings, toggle_follow} from "../../api/me_api"
import type { profile, settings } from "../../global_types";

const initialSettings: settings = {
  "two_column_posts": true
}
function isShallowEqual(obj1: any, obj2: any) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  return true;
}

export default function Home() {
  useEffect(() => { load() }, [])
  async function load() {
    const [myProfile, mySettings, followings] = await Promise.all([
      get_my_profile(),
      get_my_settings(),
      get_my_followings()
    ])
    setMyProfile(myProfile)
    setMySettings(mySettings || initialSettings)
    setFollowings(new Set(followings))
  }

  const [myProfile, setMyProfile] = useState<profile | null>(null)
  const myProfileRef = useRef(myProfile)
  useEffect(() => { myProfileRef.current = myProfile }, [myProfile])

  const [mySettings, setMySettings] = useState<settings>(initialSettings)
  const [followings, setFollowings] = useState<Set<string>>(new Set())
  const onFollow = useCallback((profile_nick: string) => {
    toggle_follow(profile_nick)
    setFollowings(prev => {
      const next = new Set(prev)
      const isFollowings = next.has(profile_nick)
      if (!isFollowings) {
        if (myProfileRef.current) {
          setMyProfile(prev => ({...prev!, "followings_count": prev!.followings_count + 1}))
        }
        next.add(profile_nick)
      } else {
        if (myProfileRef.current) {
          setMyProfile(prev => ({...prev!, "followings_count": prev!.followings_count - 1}))
        }
        next.delete(profile_nick)
      }
      return next
    })
  }, [])
  const setMe = useCallback((k: string, v: boolean) => {
    setMyProfile(prev => {
      return { ...(prev as profile), [k]: v }
  })}, [])
  const setSettings = useCallback((k: string, v: boolean) => {
    setMySettings(prev => { return { ...(prev as settings), [k]: v  }
  })}, [])


  type TabEntry = {tab: "profile"|"posts"|"settings"} | {tab: "other_profile", nick: string}
  const tabHistory = useRef<TabEntry[]>([{tab: "posts"}])
  const tabIndex = useRef(0)
  
  const [tab, setTab] = useState("posts")
  const [nickOtherProfile, setNickOtherProfile] = useState("")

  const pushToHistory = (entry: TabEntry) => {
    const prevTab = tabHistory.current[tabIndex.current]
    if (isShallowEqual(prevTab, entry)) return;

    console.log("pushed with", entry)
    tabHistory.current = tabHistory.current.slice(0, tabIndex.current + 1)
    tabHistory.current.push(entry)
    tabIndex.current = tabHistory.current.length - 1
  }
  const changeTab = (page_name: "profile"|"posts"|"settings") => {
    setTab(page_name)
    pushToHistory({tab: page_name})
  }
  
  const onOpenOtherProfile = useCallback((profile_nick: string) => {
    if (!myProfileRef.current) return
    if (profile_nick === myProfileRef.current.nick) {
      setTab("profile") 
      pushToHistory({tab: "profile"})
      return 
    }
    setNickOtherProfile(profile_nick)
    setTab("other_profile")
    pushToHistory({tab: "other_profile", nick: profile_nick})
  }, [])

  const navBack = useCallback(() => {
    if (tabIndex.current === 0) return
    const tab_entry = tabHistory.current[tabIndex.current - 1]
    if (!tab_entry) {console.error("unknow tab"); return}

    if (tab_entry.tab === "other_profile") {
      setTab("other_profile")
      setNickOtherProfile(tab_entry.nick)
    } else {
      setTab(tab_entry.tab)
    }
    tabIndex.current -= 1
  }, [])
  const navForward = useCallback(() => {
    if (tabIndex.current === tabHistory.current.length - 1) return
    const tab_entry = tabHistory.current[tabIndex.current + 1]
    if (!tab_entry) {console.error("unknow tab"); return}
    
    if (tab_entry.tab === "other_profile") {
      setTab("other_profile")
      setNickOtherProfile(tab_entry.nick)
    } else {
      setTab(tab_entry.tab)
    }
    tabIndex.current += 1
  }, [])
  

  return (<PostsProvider my_profile={myProfile}><>
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
  <header className={s.header}>
    <button onClick={navBack} className={tabIndex.current === 0 ? s.button_dis: s.button}>
      <IoArrowBack /> 
    </button>
    <button onClick={navForward} className={tabIndex.current === tabHistory.current.length - 1 ? s.button_dis: s.button}>
      <IoArrowForward />
    </button>
    <h1> {tab === "other_profile" ? "profile" : tab} </h1>
  </header>
  <main className={s.main}>
    {tab === "posts" && <>
    <PostsPage
      me={myProfile}
      settings={mySettings}
      onOpenProfile={onOpenOtherProfile}
    />
    </>}
    {tab === "profile" && <><MyProfile 
      my_profile={myProfile}
      my_settings={mySettings}

      onOpenProfile={onOpenOtherProfile}
    /></>}
    {tab === "other_profile" && <><OtherProfile 
      key={nickOtherProfile}
      my_profile={myProfile}
      my_settings={mySettings}
      other_nick={nickOtherProfile}
      is_following={followings.has(nickOtherProfile)}

      onFollow={() => onFollow(nickOtherProfile)}
      onOpenProfile={onOpenOtherProfile}
    /></>}

    <div style={{ display: tab === "settings" ? "block" : "none" }}>
      {myProfile && mySettings && <><Settings
        me={myProfile}
        settings={mySettings}
        setMe={setMe}
        setSettings={setSettings}
      /></>}
    </div>
  </main>
</div>
  </></PostsProvider>)
}