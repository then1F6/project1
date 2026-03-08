import s from './notfound.module.css'

export default function NotFound() {
  return (
    <main className={s.page}>
      <section className={s.content}>
        <p className={s.code}>404</p>
        <h1 className={s.title}>Page Not Found</h1>
        <p className={s.text}>
          The page you are trying to open does not exist in this route map.
        </p>
        <p className={s.text}>
          Check the URL and go back to the main page to continue navigation.
        </p>
        <a className={s.button} href='/'>
          Back To Home
        </a>
      </section>
    </main>
  )
}
