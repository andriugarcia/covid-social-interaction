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
  async findUsers(_, text) {
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/users/find/${text}`
      )
      return data
    } catch (err) {
      console.error(err)
      return []
    }
  },
  async follow(_, userId) {
    try {
      await axios.post(`${process.env.SERVER_URL}/follow/${userId}`)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  async unfollow(_, userId) {
    try {
      await axios.post(`${process.env.SERVER_URL}/unfollow/${userId}`)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
}
