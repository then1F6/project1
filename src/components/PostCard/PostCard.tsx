import { useState, memo } from "react";

import s from "./postcard.module.css"
import { FaCommentAlt, FaTrash, FaHeart } from "react-icons/fa";
import { FaBookmark, FaShare } from "react-icons/fa6";
import { MdMoreVert, MdContentCopy } from "react-icons/md";
import { TbMessageReport } from "react-icons/tb";
import { FiCode } from "react-icons/fi";

import ParseCount from "../../utils/parseCount"
import useTimeout from "../../hooks/useTimeout";

interface parentPD {
  onLike: (post_id: number) => void,
  onBookmark: (post_id: number) => void,
  onDeletePost: (post_id: number) => void
  onClickProfile: (profile_nick: string) => void,
}
interface PostCardProps extends parentPD {
  post_id: number,
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

const PostCard = memo((props: PostCardProps) => {
  const {
    is_me, 
    post_id,

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

  const handleLike = () => onLike(post_id)
  const handleBookmark = () => onBookmark(post_id)
  const handleDelete = () => onDeletePost(post_id)

  const [isOpenedMore, setIsOpenedMore] = useState(false)
  const [onLikeTimeout, isClickedLike] = useTimeout(handleLike, 500)
  const [onBookmarkTimeout, isClickedBookmark] = useTimeout(handleBookmark, 500)
  

  return (
<div className={is_local ? `${s.post_card} ${s.post_card_disabled}` : s.post_card}>
  <header className={isOpenedMore ? `${s.header} ${s.more_header}` : s.header}>
    {!isOpenedMore && <><div style={{"backgroundColor": author_color}} className={s.avatar_div}></div>
    <div className={s.nick_conteiner}><button onClick={() => {onClickProfile(author_nick)}}>
       <h3>{ author_nick }</h3> 
    </button></div></>}
    {isOpenedMore && <div className={s.more_conteiner}>
      {is_me &&
       <button onClick={handleDelete} disabled={is_local}><FaTrash /></button>
      }
      <button disabled={is_local}><TbMessageReport /></button>
      <button disabled={is_local}><MdContentCopy /></button>
      <button disabled={is_local}><FaShare /></button>
      <button disabled={is_local}><FaBookmark /></button>
      <button disabled={is_local}><FaHeart /></button>
      <button disabled={is_local}><FiCode /></button>
    </div>}

    <button onClick={() => setIsOpenedMore(prev => !prev)}>
      <MdMoreVert />
    </button>
  </header>
  <div className={s.content}>
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
});
export default PostCard