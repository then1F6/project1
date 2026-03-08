import s from "./postcard.module.css"

import { FaHeart } from "react-icons/fa";
import { FaCommentAlt, FaTrash } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";
import { MdMoreVert } from "react-icons/md";
import { useState } from "react";

import ParseCount from "../../utils/parseCount"
import useTimeout from "../../hooks/useTimeout";
import type { profile } from "../../global_types";

interface parentPD {
  onLike: () => void,
  onBookmark: () => void,
  onDeletePost: () => void
  onClickProfile: (profile_nick: string) => void,
}
interface PostCardProps extends parentPD {
  author_color: string,
  author_nick: string,
  post_content: string,

  likes_count: number,
  bookmarks_count: number,
  comments_count: number,
  is_liked: boolean,
  is_bookmarked: boolean,
  is_local: boolean,
  is_me: boolean,
}

export function PostCard(props: PostCardProps) {
  const {
    is_me, 

    author_color,
    author_nick,
    post_content,

    likes_count,
    bookmarks_count,
    comments_count,
    is_liked,
    is_bookmarked,
    is_local,

    onLike,
    onBookmark,
    onClickProfile,
    onDeletePost,
  } = props

  const [isOpenedMore, setIsOpenedMore] = useState(false)
  const [onLikeTimeout, isClickedLike] = useTimeout(onLike)
  const [onBookmarkTimeout, isClickedBookmark] = useTimeout(onBookmark)
  

  return (
<div className={is_local ? `${s.post_card} ${s.post_card_disabled}` : s.post_card}>
  <header className={s.header}>
    <div style={{"backgroundColor": author_color}} className={s.avatar_div}></div>
    {!isOpenedMore && <div className={s.nick_conteiner}><button onClick={() => {onClickProfile(author_nick)}}>
       <h3>{ author_nick }</h3> 
    </button></div>}
    {isOpenedMore && <div className={s.more_conteiner}>
      {is_me
      ? <button onClick={onDeletePost} disabled={is_local}><FaTrash /></button>
      : "" }
    </div>}

    <button onClick={() => setIsOpenedMore(prev => !prev)}>
      <MdMoreVert />
    </button>
  </header>
  <div>
    <p>{ post_content }</p>
  </div> 
  <footer  className={s.post_footer}>
    <div>
      <button onClick={onLikeTimeout} className={is_liked ? s.button_done : s.button}
        disabled={is_local}>
        <FaHeart className={is_liked ? s.svg_icon_done : s.svg_icon}/>
      </button>
      <h4>{ ParseCount(likes_count) }</h4>
    </div>
    <div>
      <button onClick={onBookmarkTimeout} className={is_bookmarked ? s.button_done : s.button}
        disabled={is_local}>
        <FaBookmark className={is_bookmarked ? s.svg_icon_done : s.svg_icon}/>
      </button>
      <h4>{ ParseCount(bookmarks_count) }</h4>
    </div>
    <div>
      <button className={s.button}>
        <FaCommentAlt className={s.svg_icon}/>
      </button>
      <h4>{ ParseCount(comments_count) }</h4>
    </div>
  </footer>
</div>)
}