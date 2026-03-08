import { useState, useEffect } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import s from "./settings.module.css"
import type { IconType } from 'react-icons'
import type { profile } from '../../global_types'

import { toggle_publicity_likes, toggle_publicity_bookmarks } from '../../api/me_api'


interface parameterProps {
  Icon: IconType,
  title: string,
  is_right: boolean,
  onClick: () => void,
}
function Parametr(props: parameterProps) {
  const {Icon, title, is_right, onClick} = props
  return (
  <div className={s.parametr}>
    <div> <Icon /> </div>
    <h4>{title}</h4>
    <div>
      <button className={is_right ? s.button_done : s.button} onClick={onClick}>
        <div></div>
      </button>
    </div>
  </div>
)
}

interface settingsProps { me: profile};

export default function Settings(props: settingsProps) {
  const {me} = props
  const [done, setDone] = useState<{[key: string]: boolean}>({})

  useEffect(() => {
    setDone({
      "is_public_likes": me.is_public_likes,
      "is_public_bookmarks": me.is_public_bookmarks,
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
        }}
        />

      </div>
    </section>
  </div>
</div>)
}