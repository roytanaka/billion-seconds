/**
 * Creates a stable DOM structure inside `container` for the seconds display.
 * Returns an `update(secondsData)` function called on each interval tick.
 *
 * @param {HTMLElement} container - The #seconds element
 * @param {Function} onStartOver - Called when the "Try another date" button is clicked
 */
export function initRenderer(container, onStartOver) {
  const secondsEl = document.createElement('div')
  secondsEl.className = 'seconds'

  const infoEl = document.createElement('div')
  infoEl.className = 'info'

  const fromDateEl = document.createElement('p')

  const milestone1El = document.createElement('div')
  const milestone1Small = document.createElement('small')
  milestone1El.appendChild(milestone1Small)

  const milestone2El = document.createElement('div')
  const milestone2Small = document.createElement('small')
  milestone2El.appendChild(milestone2Small)

  infoEl.append(fromDateEl, milestone1El, milestone2El)

  const startOverBtn = document.createElement('button')
  startOverBtn.className = 'btn-start-over'
  startOverBtn.type = 'button'
  startOverBtn.textContent = 'Try another date'
  startOverBtn.addEventListener('click', onStartOver)

  container.append(secondsEl, infoEl, startOverBtn)

  return function update(data) {
    if (!data.dateValid) {
      container.innerHTML = '<h2 class="info">Oops. Invalid Date</h2>'
      return
    }
    secondsEl.textContent = data.seconds
    fromDateEl.textContent = `seconds since ${data.fromDate}`
    milestone1Small.textContent = `Your 1st billionth second ${data.billionthSecondDay.tense} on ${data.billionthSecondDay.date}`
    milestone2Small.textContent = `Your 2nd billionth second ${data.twoBillionthSecondDay.tense} on ${data.twoBillionthSecondDay.date}`
  }
}
