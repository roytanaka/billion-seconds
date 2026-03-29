import './css/style.css'
import { initStars } from './stars.js'
import { initRenderer } from './renderer.js'
import * as dateBuilder from './date-builder.js'

// Start the canvas starfield
initStars()

// Populate date/time selectors
const year = document.querySelector('#year')
const modalYear = document.querySelector('#modalYear')
const yearsOptions = dateBuilder.years.map(
  y => `<option value="${y}">${y}</option>`
)
year.innerHTML = yearsOptions.join('')
modalYear.innerHTML = yearsOptions.join('')

const month = document.querySelector('#month')
const modalMonth = document.querySelector('#modalMonth')
const monthsOptions = dateBuilder.months.map(
  (m, i) => `<option value="${i}">${m}</option>`
)
month.innerHTML = monthsOptions.join('')
modalMonth.innerHTML = monthsOptions.join('')

const date = document.querySelector('#date')
const modalDate = document.querySelector('#modalDate')
const datesOptions = [...Array(31).keys()]
  .map(x => 1 + x)
  .map(d => `<option value="${d}">${d}</option>`)
date.innerHTML = datesOptions.join('')
modalDate.innerHTML = datesOptions.join('')

const hour = document.querySelector('#hour')
const modalHour = document.querySelector('#modalHour')
const hoursOptions = dateBuilder.hours.map((h, i) => {
  const padded = h.toString().replace(/(^\d$)/, '0$1')
  return `<option value="${i}">${padded}</option>`
})
hour.innerHTML = hoursOptions.join('')
modalHour.innerHTML = hoursOptions.join('')

const minute = document.querySelector('#minute')
const modalMinute = document.querySelector('#modalMinute')
const minutesOptions = dateBuilder.minutes.map((m, i) => {
  const padded = m.toString().replace(/(^\d$)/, '0$1')
  return `<option value="${i}">${padded}</option>`
})
minute.innerHTML = minutesOptions.join('')
modalMinute.innerHTML = minutesOptions.join('')

// Modal change listeners — update preview as user picks values
const modal = document.querySelector('.modal')
const modalSelectors = modal.querySelectorAll('select')
const errorMsg = modal.querySelector('.modal-error')

for (const select of modalSelectors) {
  select.addEventListener('change', () => {
    errorMsg.setAttribute('aria-hidden', 'true')
    updateDate(
      modalYear.value,
      modalMonth.value,
      modalDate.value,
      modalHour.value,
      modalMinute.value
    )
  })
}

// Footer selector change listeners
const footerSelectors = document.querySelectorAll('footer select')
for (const select of footerSelectors) {
  select.addEventListener('change', () => {
    updateDate(year.value, month.value, date.value, hour.value, minute.value)
  })
}

const newBirthday = document.querySelector('#getSeconds')
const secondsContainer = document.querySelector('#seconds')
const footerDate = document.querySelector('footer .date-selectors')

let bday
let secondsData
let updateRenderer

// Modal submit
newBirthday.addEventListener('click', () => {
  if (!secondsData.dateValid) {
    return errorMsg.setAttribute('aria-hidden', 'false')
  }

  // Sync footer selectors to modal values
  year.value = modalYear.value
  month.value = modalMonth.value
  date.value = modalDate.value
  hour.value = modalHour.value
  minute.value = modalMinute.value

  animateCSS('.modal', 'zoomOut', () =>
    modal.setAttribute('aria-hidden', 'true')
  )

  // Initialize the renderer once the container is visible
  secondsContainer.setAttribute('aria-hidden', 'false')
  animateCSS('#seconds', 'zoomInUp')
  updateRenderer = initRenderer(secondsContainer)

  setTimeout(() => {
    animateCSS('footer .date-selectors', 'bounceInUp')
    footerDate.setAttribute('aria-hidden', 'false')
  }, 800)
})

function updateDate(y, m, d, h, min) {
  bday = dateBuilder.makeBday(
    Number(y), Number(m), Number(d), Number(h), Number(min)
  )
  secondsData = dateBuilder.getSecondsData(bday)
}

// Initialize with a default date so secondsData is always defined
updateDate(2020, 0, 1, 0, 0)

// Render loop — updates the live second count every 100ms
setInterval(() => {
  const liveSeconds = Math.floor((Date.now() - bday.valueOf()) / 1000)
  secondsData.seconds = liveSeconds
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  if (updateRenderer) {
    updateRenderer(secondsData)
  }
}, 100)

function animateCSS(element, animationName, callback) {
  const node = document.querySelector(element)
  node.classList.add('animated', animationName)

  function handleAnimationEnd() {
    node.classList.remove('animated', animationName)
    node.removeEventListener('animationend', handleAnimationEnd)
    if (typeof callback === 'function') callback()
  }

  node.addEventListener('animationend', handleAnimationEnd)
}
