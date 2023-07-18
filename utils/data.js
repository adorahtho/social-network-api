const names = [
  'TJ',
  'Annabelle',
  'Serenity',
  'Jaia',
  'Tong',
  'Eve',
  'Philip',
  'Yang',
  'Nguyen',
  'Tho',
  'Thor',
  'Shinie',
  'Danny',
  'Ge',
  'Kalia',
  'Treu',
  'Thao',
]

// Get a random item given an array
const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Gets a random full name
const getRandomUsername = () =>
  `${getRandomArrItem(names)}${Math.floor(Math.random() * 900) + 100}`;

  
module.exports = { getRandomUsername }