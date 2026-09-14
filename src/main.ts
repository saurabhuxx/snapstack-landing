const header = document.querySelector<HTMLElement>('.site-header')
const toggle = document.querySelector<HTMLButtonElement>('.nav-toggle')
const nav = document.querySelector<HTMLElement>('#site-nav')

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

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setNav(false)
})
