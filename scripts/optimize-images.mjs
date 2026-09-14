import sharp from 'sharp'
import { mkdir, readdir, unlink } from 'node:fs/promises'
import path from 'node:path'

const imagesDir = path.resolve('public/images')
const files = (await readdir(imagesDir)).filter((f) => f.endsWith('.png'))

await mkdir(imagesDir, { recursive: true })

for (const file of files) {
  const input = path.join(imagesDir, file)
  const stem = file.replace(/\.png$/i, '')
  const image = sharp(input).resize({ width: 1100, withoutEnlargement: true })
  await image.clone().webp({ quality: 82, effort: 6 }).toFile(path.join(imagesDir, `${stem}.webp`))
  await image.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(imagesDir, `${stem}.jpg`))
  await unlink(input)
  console.log('wrote', stem)
}

await sharp('public/og.png')
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/og.jpg')

await unlink('public/og.png').catch(() => {})
await unlink('public/og.webp').catch(() => {})
console.log('wrote og.jpg')
