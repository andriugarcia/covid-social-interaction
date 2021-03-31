import axios from 'axios'

export const actions = {
  async getUser(_, username) {
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/users/${username}`
      )
      return data
    } catch (err) {
      console.error(err)
      return []
    }
  },
  async getPeople(_) {
    try {
      const { data } = await axios.get(`${process.env.SERVER_URL}/people`)
      return data
    } catch (err) {
      console.error(err)
      return []
    }
  },
}
