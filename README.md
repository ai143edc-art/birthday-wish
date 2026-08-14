# 🎂 A Little Surprise — Birthday Wish

Ek auto-play "movie" birthday surprise, meri behen ke liye banaya ❤️
Behen sirf **ek baar "Tap to start"** dabati hai — phir sab apne aap chalta hai:
reveal → magical tree → dil se message → photo slideshow → cake (wish) → fireworks finale.

Chhote aur purane phone par bhi smooth chalne ke liye tuned hai (halke particles,
real-height fix taaki address bar se kuch cut na ho, aur photo fail ho to graceful fallback).

## ✏️ Customize kaise karein
Sab kuch `script.js` ke upar wale **CONFIG** block me hai:

| Setting | Kya hai |
|---|---|
| `sisterName` | Behen ka naam |
| `brotherName` | Sign-off naam |
| `birthdayDate` | Birthday ki date (naam ke neeche) |
| `birthdayMessage` | Poora personal message |
| `finalMessage` | Aakhri line |
| `musicSrc` | Gaana (`audio/birthday.mp3`) |
| `photos` | Slideshow ki photos ki list |
| `slideCaptions` | Har photo ke neeche caption |

## 🎵 Gaana
`audio/` folder me apna gaana `birthday.mp3` naam se daal do (ya `CONFIG.musicSrc` badal do).
Gaana na ho to bhi movie normal chalegi — sound button chhup jaata hai.

## 🖼️ Photos
`images/` me `photo1.jpg`, `photo2.jpg`... daalo aur `CONFIG.photos` me list karo.
Portrait (4:5) photos best dikhti hain. Photo na ho to sundar placeholder aata hai.

## ▶️ Chalane ke liye
Bas `index.html` browser me kholo. Koi build/setup nahi chahiye — pure HTML/CSS/JS.

Made with love. ❤️
