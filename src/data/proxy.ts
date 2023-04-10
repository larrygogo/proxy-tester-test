import {v4 as uuidV4} from "uuid";

const data = ``

const array = data.split('\n').map(item => {
  const [host, port, username, password] = item.split(':')
  return {
    id: uuidV4(),
    host,
    port,
    username,
    password
  }
})

export default array