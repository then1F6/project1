import s from "./error.module.css"

const ERORRS = {
  UNAUTHORIZED: {
    text: "Нужно залогиниться для доступа",
    color: "#f77"
  },
  BAD_CONNECTION: {
    text: "Слабое подключение к сети",
    color: "#ff7"
  },
  SERVER_ERROR: {
    text: "Проблема на сервере, чиним!",
    color: "#ff7"
  }
}

export default function ErrorModal({ ERROR_NAME }) {
  if (ERROR_NAME === undefined) return null;

  const {text, color} = ERORRS[ERROR_NAME]
  
  return (<>
<div className={s.container}>
  <div className={s.block}> 
    <h2> Error </h2>
    <div style={{ backgroundColor: color}}>
      <p>{ text }</p>{ERROR_NAME === "UNAUTHORIZED" ? <a href="/login">логин</a> : "" }
    </div>
  </div>
</div>
  </>)
}