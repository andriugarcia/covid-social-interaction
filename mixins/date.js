import dayjs from 'dayjs'
import('dayjs/locale/es')

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
      return dayjs(value).locale('es').format('dddd D MMMM')
    },
    toDateShort(value) {
      return dayjs(value).locale('es').format('ddd D HH:mm')
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
        return 'Ayer'
      } else {
        return dayjs(value).locale('es').format('DD/MM/YYYY')
      }
    },
  },
}
