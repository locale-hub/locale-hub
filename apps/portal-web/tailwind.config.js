const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

const safeList = [
  // generate width from 0% to 100%
  ...[...Array(101).keys()].map(id => `w-[${id}%]`)
];

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{app,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class',
  safelist: safeList,
  theme: {
    extend: {
      colors: {
        primary: '#02CFFC',
        accent: '#008CD1',
        warn: '#FF546C',
        green: '#00ffc3',
        dark: '#202225'
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
};
