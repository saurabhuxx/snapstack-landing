import {
  defaultFilters,
  filterReviews,
  reviewCardHtml,
  reviews,
  type ReviewFilters,
} from './reviews'

const header = document.querySelector<HTMLElement>('.site-header')
const toggle = document.querySelector<HTMLButtonElement>('.nav-toggle')
const nav = document.querySelector<HTMLElement>('#site-nav')
const reviewsGrid = document.querySelector<HTMLElement>('#reviews-grid')
const reviewsModal = document.querySelector<HTMLElement>('#reviews-modal')
const reviewsList = document.querySelector<HTMLElement>('#reviews-modal-list')
const reviewsCount = document.querySelector<HTMLElement>('#reviews-modal-count')
const reviewsFilters = document.querySelector<HTMLFormElement>('#reviews-filters')
const reviewsDialog = document.querySelector<HTMLElement>('.reviews-modal-dialog')

const onScroll = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 12)
}

onScroll()
window.addEventListener('scroll', onScroll, { passive: true })

const setNav = (open: boolean) => {
  if (!toggle || !nav) return
  toggle.setAttribute('aria-expanded', String(open))
  nav.classList.toggle('is-open', open)
  document.body.classList.toggle('nav-open', open)
}

toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true'
  setNav(open)
})

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setNav(false))
})

if (reviewsGrid) {
  reviewsGrid.innerHTML = reviews.map((review) => reviewCardHtml(review, { clamp: true })).join('')
}

const checkboxes = (name: string) =>
  Array.from(reviewsFilters?.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`) ?? [])

const syncAllToggle = (allName: string, optionName: string) => {
  const all = reviewsFilters?.querySelector<HTMLInputElement>(`input[name="${allName}"]`)
  if (!all) return
  const options = checkboxes(optionName)
  if (all.checked) {
    options.forEach((input) => {
      input.checked = false
    })
    return
  }
  if (!options.some((input) => input.checked)) {
    all.checked = true
  }
}

const readFilters = (): ReviewFilters => {
  if (!reviewsFilters) return defaultFilters()
  const data = new FormData(reviewsFilters)
  const allStars = data.get('star-all') === 'all'
  const allSentiments = data.get('sentiment-all') === 'all'
  return {
    stars: allStars ? [] : data.getAll('star').map((value) => Number(value)),
    sentiments: allSentiments ? [] : (data.getAll('sentiment') as ReviewFilters['sentiments']),
    range: (data.get('range') as ReviewFilters['range']) || 'lifetime',
  }
}

const renderModalList = () => {
  if (!reviewsList || !reviewsCount) return
  const matched = filterReviews(reviews, readFilters())
  reviewsCount.textContent = matched.length
    ? `${matched.length} review${matched.length === 1 ? '' : 's'}`
    : 'No reviews match these filters.'
  reviewsList.innerHTML = matched.length
    ? matched.map((review) => reviewCardHtml(review)).join('')
    : ''
}

const setReviewsModal = (open: boolean) => {
  if (!reviewsModal) return
  reviewsModal.hidden = !open
  document.body.classList.toggle('reviews-open', open)
  if (open) {
    renderModalList()
    reviewsDialog?.focus()
  }
}

document.addEventListener('click', (event) => {
  const target = event.target
  if (!(target instanceof Element)) return
  if (target.closest('[data-open-reviews]')) {
    event.preventDefault()
    setReviewsModal(true)
  }
  if (target.closest('[data-close-reviews]')) {
    setReviewsModal(false)
  }
})

reviewsFilters?.addEventListener('change', (event) => {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    if (target.name === 'star' && target.checked) {
      const all = reviewsFilters.querySelector<HTMLInputElement>('input[name="star-all"]')
      if (all) all.checked = false
    }
    if (target.name === 'sentiment' && target.checked) {
      const all = reviewsFilters.querySelector<HTMLInputElement>('input[name="sentiment-all"]')
      if (all) all.checked = false
    }
    if (target.name === 'star-all' || target.name === 'star') {
      syncAllToggle('star-all', 'star')
    }
    if (target.name === 'sentiment-all' || target.name === 'sentiment') {
      syncAllToggle('sentiment-all', 'sentiment')
    }
  }
  renderModalList()
})

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return
  if (reviewsModal && !reviewsModal.hidden) {
    setReviewsModal(false)
    return
  }
  setNav(false)
})
