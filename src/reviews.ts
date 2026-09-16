export type Review = {
  name: string
  initial: string
  avatar: string
  stars: 1 | 2 | 3 | 4 | 5
  date: string
  text: string
}

export const reviews: Review[] = [
  {
    name: 'The Aarav Sharma G',
    initial: 'A',
    avatar: '28 72% 42%',
    stars: 5,
    date: '2026-09-15',
    text: "SnapStack is a really useful and simple Chrome extension for taking and organizing screenshots. I especially like the full-page, visible-area, and selected-area capture options. The project-based organization keeps everything neat and easy to find, and the local-first approach is a big plus for privacy. Overall, it's clean, fast, and genuinely helpful for anyone who takes a lot of screenshots.",
  },
  {
    name: 'Ankit Dwivedi',
    initial: 'A',
    avatar: '12 72% 42%',
    stars: 5,
    date: '2026-09-15',
    text: 'very helpful for taking screenshot of full pages even while on the calls with my clients and download all at once thanks',
  },
  {
    name: 'Anmol Sharma',
    initial: 'A',
    avatar: '220 16% 28%',
    stars: 5,
    date: '2026-09-13',
    text: "As a student, I take a lot of screenshots every day for different projects, and it often becomes difficult to find the specific screenshot I need later that's where it made my life really easy organizing them in a better way",
  },
  {
    name: 'ranu Sharma',
    initial: 'R',
    avatar: '32 48% 38%',
    stars: 5,
    date: '2026-09-13',
    text: 'Taking full-page screenshots has never been easier. Just one click to capture, then bundle everything into folders—making it super easy to organize and manage screenshots across multiple projects.',
  },
  {
    name: 'Popsicle Flicks',
    initial: 'P',
    avatar: '48 92% 48%',
    stars: 5,
    date: '2026-09-12',
    text: "I’ve been using SnapStack for a while now, and it has made managing my screenshots so much easier. I take a lot of screenshots while browsing websites, especially for design references, research, and project ideas, and my Downloads folder used to get completely cluttered.\n\nWhat I really like about SnapStack is that I can keep my screenshots organized into projects and sessions instead of having hundreds of random screenshot files everywhere. The capture process is quick and simple, and everything feels very easy to manage.\n\nIt’s a genuinely useful extension if you take screenshots regularly. Simple, clean, and actually solves a problem I had every day.",
  },
  {
    name: 'Udyam Pharma',
    initial: 'U',
    avatar: '20 28% 42%',
    stars: 5,
    date: '2026-09-15',
    text: 'It’s a great Chrome extension for taking screenshots quickly and easily. You can capture a full-page screenshot, Chrome tab screenshot, or a specific selected area with just a few clicks. Highly recommended if you’re looking for a simple and reliable screenshot tool for Chrome—especially for capturing webpages and saving full-page screenshots.',
  },
  {
    name: 'Shivam Thakur',
    initial: 'S',
    avatar: '200 18% 36%',
    stars: 5,
    date: '2026-09-13',
    text: 'Literally very helpful tool.',
  },
]

const STAR_PATH =
  'M12 2.5l2.7 6.6 7.1.6-5.4 4.6 1.6 6.8L12 17.8 5.9 21.1l1.6-6.8L2.2 9.7l7.1-.6L12 2.5z'

const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

const starIcons = (count: number) =>
  Array.from({ length: count }, () => `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="${STAR_PATH}"/></svg>`).join('')

export const reviewCardHtml = (review: Review, options: { clamp?: boolean } = {}) => {
  const paragraphs = review.text
    .split('\n\n')
    .map((part) => part.replaceAll('\n', ' '))
    .join('<br /><br />')

  return `
    <article class="review-card">
      <header>
        <span class="review-avatar" style="--avatar: ${review.avatar}" aria-hidden="true">${review.initial}</span>
        <div class="review-meta">
          <strong>${review.name}</strong>
          <p class="review-stars">
            ${starIcons(review.stars)}
            <span class="visually-hidden">${review.stars} out of 5 stars</span>
            <time datetime="${review.date}">${formatDate(review.date)}</time>
          </p>
        </div>
      </header>
      <blockquote${options.clamp ? ' class="review-clamp"' : ''}>${paragraphs}</blockquote>
      ${options.clamp ? '<button type="button" class="review-more" data-open-reviews>Read more</button>' : ''}
    </article>
  `
}

export type ReviewFilters = {
  stars: number[]
  sentiments: Array<'positive' | 'negative'>
  range: 'week' | 'weeks' | 'month' | 'months' | 'lifetime'
}

export const defaultFilters = (): ReviewFilters => ({
  stars: [5],
  sentiments: ['positive'],
  range: 'lifetime',
})

const sentimentOf = (stars: number): 'positive' | 'negative' | 'neutral' => {
  if (stars >= 4) return 'positive'
  if (stars <= 2) return 'negative'
  return 'neutral'
}

const inRange = (iso: string, range: ReviewFilters['range'], now = new Date()) => {
  if (range === 'lifetime') return true
  const posted = new Date(`${iso}T12:00:00`).getTime()
  const days =
    range === 'week' ? 7 : range === 'weeks' ? 14 : range === 'month' ? 30 : 90
  return now.getTime() - posted <= days * 24 * 60 * 60 * 1000
}

export const filterReviews = (items: Review[], filters: ReviewFilters) =>
  items.filter((review) => {
    if (filters.stars.length && !filters.stars.includes(review.stars)) return false
    if (filters.sentiments.length) {
      const mood = sentimentOf(review.stars)
      if (mood === 'neutral' || !filters.sentiments.includes(mood)) return false
    }
    return inRange(review.date, filters.range)
  })
