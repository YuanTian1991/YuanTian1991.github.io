import Typography from "typography";
import ParnassusTheme from 'typography-theme-parnassus'

ParnassusTheme.overrideThemeStyles = ({ rhythm }, options) => ({
  "h1,h2,h3,h4,h5,h6": {
    marginTop: rhythm(1 / 3),
    marginBottom: rhythm(1 / 2),
  },
  "img": {
      borderRadius: '6px',
  },
  "pre": {
      border: '1px solid lightgrey',
  }
});

const typography = new Typography(
  // {
  //   baseFontSize: '18px',
  //   baseLineHeight: 1.666,
  //   headerFontFamily: ['Avenir Next', 'Helvetica Neue', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
  //   bodyFontFamily: ['Avenir Next', 'Helvetica Neue', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
  // },
  ParnassusTheme
);

export default typography;