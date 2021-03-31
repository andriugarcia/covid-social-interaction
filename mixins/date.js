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
  },
}
