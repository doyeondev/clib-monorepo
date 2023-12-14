/**
 * usage: const now = new Date()
 * - formatDate(now, 'yyyy-MM-dd HH:mm:ss') // 2019-03-28 12:12:12
 * - formatDate(now, 'yyMMdd') // 190328
 * - formatDate(now, 'a/p hh시 mm분') // 오후 03시 28분
 * - formatDate(now, 'MM월 dd일 E') // 03월 28일 목요일
 */

// const now = new Date()
// let myDateFormat = 'yyyy년 MM월 dd일(E) a/p hh:mm'

export function formatDate(d, type) {
  let format
  if (type === 'full') format = 'yyyy년 MM월 dd일(E) a/p hh:mm'
  if (type === 'short') format = 'yyyy. MM. dd.'

  // const weekName = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const weekName = ['일', '월', '화', '수', '목', '금', '토']
  const h = d.getHours() % 12

  const now = new Date()
  if (now.getFullYear() !== d.getFullYear()) {
    format = 'yy년 ' + format
  }

  return format.replace(/(yyyy|yy|MM|dd|E|hh|mm|sss|ss|a\/p)/gi, function (ele) {
    switch (ele) {
      case 'yyyy':
        return d.getFullYear()
      case 'yy':
        // return (d.getFullYear() % 1000).subFormatNum(2); // subFormatNum(d.getFullYear() % 1000, 2)
        return subFormatNum(d.getFullYear() % 1000, 2)
      case 'MM':
        return subFormatNum(d.getMonth() + 1, 2)
      case 'dd':
        return subFormatNum(d.getDate(), 2)
      case 'E':
        return weekName[d.getDay()]
      case 'HH':
        return subFormatNum(d.getHours(), 2)
      case 'hh':
        return subFormatNum(h ? h : 12, 2)
      // return (((d.getHours() % 12) ? (d.getHours() % 12) : 12)).subFormat(2);
      case 'mm':
        return subFormatNum(d.getMinutes(), 2)
      case 'sss':
        return subFormatNum(d.getMilliseconds(), 3)
      case 'ss':
        return subFormatNum(d.getSeconds(), 2)
      case 'a/p':
        return d.getHours() < 12 ? '오전' : '오후'
      default:
        return ele
    }
  })
}

function subFormatNum(num, len) {
  return subFormat(num.toString(), len)
}

function subFormat(foo, len) {
  // return num.toString().subFormat(len)
  return string('0', len - foo.length) + foo
}

function string(bar, len) {
  let s = ''
  let i = 0
  while (i++ < len) {
    s += bar
  }
  return s
}

export function dateFormatter(date) {
  const dateString = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })
  const dayName = date.toLocaleDateString('ko-KR', {
    weekday: 'long'
  })
  return `${dateString} ${dayName.substring(0, 1)}`
}

export function addDaysToDate(oldDate, daysToAdd) {
  let newDate = new Date(oldDate.toLocaleDateString())
  return newDate.setDate(newDate.getDate() + daysToAdd)
}
