/**
 * Creates a stable DOM structure inside `container` for the seconds display.
 * Returns an `update(secondsData)` function called on each interval tick.
 *
 * Using stable nodes (textContent updates) instead of innerHTML prevents
 * DOM teardown/rebuild on every tick and allows future modules (share, easter egg)
 * to safely hold references to child elements.
 */
export function initRenderer(container) {
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
  container.append(secondsEl, infoEl)

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
