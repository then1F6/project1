const API_URL = "/api" 


async function cookie_fetch(url: string, options: { [key: string]: any }) {
  const _url = `${API_URL}${url}`

  const res = await fetch(_url, {...options, credentials: "include"})

  if (res.status === 401) {
    console.log("Access expiried")
    const refresh_res = await fetch(`${API_URL}/auth/refresh`, {method: "POST", credentials: "include"});

    if (refresh_res.status === 401) {
      console.log("Need to login again")
      return 
    }

    const retry_res = await fetch(_url, {...options, credentials: "include"})
    const data = await retry_res.json()
    return data
  }
  const data = await res.json()
  return data
}
async function basic_fetch( url: string, options: { [key: string]: any } ) {
  const _url = `${API_URL}${url}`
  const res = await fetch(_url, options)
  const data = await res.json()
  return data
}


class http_clinet {
  async get(path: string, optoins = {}, cookie = false) {
    if (cookie) {
      const data = await cookie_fetch(path, {method: "GET", ...optoins})
      return data
    } else {
      const data = await basic_fetch(path, {method: "GET", ...optoins})
      return data
    }
  }
  async post(path: string, optoins = {}, cookie = false) {
    if (cookie) {
      const data = await cookie_fetch(path, {method: "POST", ...optoins})
      return data
    } else {
      const data = await basic_fetch(path, {method: "POST", ...optoins})
      return data
    }
  }
  async delete(path: string, optoins = {}, cookie = false) {
    if (cookie) {
      const data = await cookie_fetch(path, {method: "DELETE", ...optoins})
      return data
    } else {
      const data = await basic_fetch(path, {method: "DELETE", ...optoins})
      return data
    }
  }
  async put(path: string, optoins = {}, cookie = false) {
    if (cookie) {
      const data = await cookie_fetch(path, {method: "PUT", ...optoins})
      return data
    } else {
      const data = await basic_fetch(path, {method: "PUT", ...optoins})
      return data
    }
  }
}

const http = new http_clinet()
export default http 
