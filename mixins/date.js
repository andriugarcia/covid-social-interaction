import dayjs from 'dayjs'
import('dayjs/locale/en')

export default {
  filters: {
    toHour(value) {
      const date = new Date(value)
      return (
        date.getHours() +
        ':' +
        (date.getMinutes() < 10 ? '0' : '') +
        date.getMinutes()
      )
    },
    toDate(value) {
      return dayjs(value).locale('en').format('dddd D MMMM')
    },
    toDateShort(value) {
      return dayjs(value).locale('en').format('ddd D HH:mm')
    },
    toRelativeDate(value) {
      const date = new Date(value)
      const now = new Date()
      if (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      ) {
        return (
          date.getHours() +
          ':' +
          (date.getMinutes() < 10 ? '0' : '') +
          date.getMinutes()
        )
      } else if (
        date.getDate() - 1 === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()) {
        return 'Yesterday'
      } else {
        return dayjs(value).locale('en').format('DD/MM/YYYY')
      }
    },
  },
}
