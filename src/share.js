/**
 * Appends a share button + popover to `container`.
 *
 * Mobile: fires native Web Share API directly, no popover.
 * Desktop: opens a small popover with copy-link (primary) + X/Facebook (secondary).
 *
 * @param {HTMLElement} container - The #seconds element
 * @param {Function} getSecondsData - Returns the current secondsData object
 */
export function initShare(container, getSecondsData) {
  const wrapper = document.createElement('div')
  wrapper.className = 'share-actions'

  const shareBtn = document.createElement('button')
  shareBtn.className = 'btn-share'
  shareBtn.type = 'button'
  shareBtn.textContent = 'Share'
  shareBtn.setAttribute('aria-haspopup', 'true')
  shareBtn.setAttribute('aria-expanded', 'false')

  // Popover
  const popover = document.createElement('div')
  popover.className = 'share-popover'
  popover.setAttribute('aria-hidden', 'true')
  popover.setAttribute('role', 'dialog')
  popover.setAttribute('aria-label', 'Share options')

  // Copy link row
  const copyBtn = document.createElement('button')
  copyBtn.className = 'share-copy'
  copyBtn.type = 'button'
  copyBtn.textContent = 'Copy link'

  const copyConfirm = document.createElement('span')
  copyConfirm.className = 'share-copy-confirm'
  copyConfirm.setAttribute('aria-live', 'polite')
  copyConfirm.textContent = ''

  const copyRow = document.createElement('div')
  copyRow.className = 'share-copy-row'
  copyRow.append(copyBtn, copyConfirm)

  // Divider
  const divider = document.createElement('div')
  divider.className = 'share-divider'

  // Platform links row
  const platformRow = document.createElement('div')
  platformRow.className = 'share-platforms'

  const twitterLink = document.createElement('a')
  twitterLink.className = 'share-platform-link'
  twitterLink.target = '_blank'
  twitterLink.rel = 'noopener noreferrer'
  twitterLink.textContent = 'Post on X'

  const facebookLink = document.createElement('a')
  facebookLink.className = 'share-platform-link'
  facebookLink.target = '_blank'
  facebookLink.rel = 'noopener noreferrer'
  facebookLink.textContent = 'Facebook'

  platformRow.append(twitterLink, facebookLink)
  popover.append(copyRow, divider, platformRow)
  wrapper.append(shareBtn, popover)
  container.appendChild(wrapper)

  function buildShareData() {
    const data = getSecondsData()
    const url = window.location.href
    const text = `I've been alive for ${data.seconds} seconds. My 1 billionth second ${data.billionthSecondDay.tense} on ${data.billionthSecondDay.date}. Find yours at`
    return { url, text }
  }

  function openPopover() {
    const { url, text } = buildShareData()
    const encodedText = encodeURIComponent(`${text} ${url}`)
    const encodedUrl = encodeURIComponent(url)

    twitterLink.href = `https://twitter.com/intent/tweet?text=${encodedText}`
    facebookLink.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`

    popover.setAttribute('aria-hidden', 'false')
    shareBtn.setAttribute('aria-expanded', 'true')
  }

  function closePopover() {
    popover.setAttribute('aria-hidden', 'true')
    shareBtn.setAttribute('aria-expanded', 'false')
  }

  const isTouchDevice = navigator.maxTouchPoints > 0 || 'ontouchstart' in window

  shareBtn.addEventListener('click', async (e) => {
    e.stopPropagation()

    // Mobile/touch: use native share sheet directly
    if (navigator.share && isTouchDevice) {
      const { url, text } = buildShareData()
      try {
        await navigator.share({ title: 'Billion Seconds Counter', text, url })
      } catch (err) {
        if (err.name !== 'AbortError') openPopover()
      }
      return
    }

    // Desktop: toggle popover
    const isOpen = popover.getAttribute('aria-hidden') === 'false'
    isOpen ? closePopover() : openPopover()
  })

  // Copy link
  copyBtn.addEventListener('click', async () => {
    const { url, text } = buildShareData()
    try {
      await navigator.clipboard.writeText(`${text} ${url}`)
      copyConfirm.textContent = '✓ Copied!'
      copyBtn.textContent = 'Copied!'
      setTimeout(() => {
        copyConfirm.textContent = ''
        copyBtn.textContent = 'Copy link'
      }, 1500)
    } catch {
      // Clipboard API unavailable — select the URL as fallback
      copyConfirm.textContent = url
    }
  })

  // Close popover on outside click
  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) closePopover()
  })

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePopover()
  })
}
