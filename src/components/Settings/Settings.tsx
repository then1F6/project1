import { useState, useEffect, type JSX } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import s from "./settings.module.css"
import type { IconType } from 'react-icons'
import type { profile, settings } from '../../global_types'

import { toggle_publicity_likes, toggle_publicity_bookmarks, toggle_settings } from '../../api/me_api'


interface parameterProps {
  Icon: JSX.Element | IconType,
  title: string,
  is_right: boolean,
  onClick: () => void,
}
function Parametr(props: parameterProps) {
  const {Icon, title, is_right, onClick} = props
  return (
  <div className={s.parametr}>
    <div> {typeof Icon === 'function' ? <Icon />: Icon} </div>
    <h4>{title}</h4>
    <div>
      <button className={is_right ? s.button_done : s.button} onClick={onClick}>
        <div></div>
      </button>
    </div>
  </div>
)
}

interface settingsProps { 
  me: profile
  settings: settings
  setMe: (k: string, v: boolean) => void
  setSettings: (k: string, v: boolean) => void
};

const oneColumn = (<svg viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org">
  <rect x="30" y="0" width="40" height="100" rx="5" fill="white" />
</svg>)
const twoColumn = (<svg viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org">
  <rect x="3" y="0" width="40" height="100" rx="5" fill="white" />
  <rect x="57" y="0" width="40" height="100" rx="5" fill="white" />
</svg>
)


export default function Settings(props: settingsProps) {
  const {me, settings, setSettings, setMe} = props
  const [done, setDone] = useState<{[key: string]: boolean}>({})

  useEffect(() => {
    setDone({
      "is_public_likes": me.is_public_likes,
      "is_public_bookmarks": me.is_public_bookmarks,
      "two_column_of_posts": settings.two_column_posts,
    })
  }, [])


  return (<div className={s.settings}>
  <div className={s.settings_main}>
    <section className={s.section}>
      <h3>Profile</h3>
      <div className={s.parametrs_container}>
        <Parametr 
          Icon={done["is_public_likes"] ? FaEye: FaEyeSlash}
          title="Public likes"
          is_right={done["is_public_likes"] || false}
          onClick={() => {setDone(prev => ({
            ...prev,
            "is_public_likes": !prev.is_public_likes
          })); toggle_publicity_likes()
          setMe("is_public_likes", !me.is_public_likes)
        }}
        />
        <Parametr 
          Icon={done["is_public_bookmarks"] ? FaEye: FaEyeSlash}
          title="Public bookmarks"
          is_right={done["is_public_bookmarks"] || false}
          onClick={() => {setDone(prev => ({
            ...prev,
            "is_public_bookmarks": !prev.is_public_bookmarks
          })); toggle_publicity_bookmarks()
          setMe("is_public_bookmarks", !me.is_public_bookmarks)
        }}
        />

      </div>
    </section>
    <section className={s.section}>
      <h3>View</h3>
      <div className={s.parametrs_container}>
        <Parametr 
          Icon={done["two_column_of_posts"] ? twoColumn: oneColumn}
          title="Two column of posts"
          is_right={!!done["two_column_of_posts"]}
          onClick={() => {setDone(prev => ({
            ...prev,
            "two_column_of_posts": !prev.two_column_of_posts
          }));  toggle_settings("two_column_posts");
          setSettings("two_column_posts", !settings.two_column_posts)
        }}
        />
      </div>
    </section>
  </div>
</div>)
}