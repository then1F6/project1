import http from './http_client'

export async function login_api(email: string, password: string) {
  const data = await http.post("/auth/login", {
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({email, password})
  }, false)
  return data
}

export async function register_api(nick: string, email: string, 
  password: string, confirm_password: string
) {
  const data = await http.post("/auth/register", {
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({nick, email, password, confirm_password})
  }, false)
  return data
}