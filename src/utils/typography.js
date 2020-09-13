import Typography from "typography";
import ParnassusTheme from 'typography-theme-parnassus'

ParnassusTheme.overrideThemeStyles = ({ rhythm }, options) => ({
  "h1,h2,h3,h4,h5,h6": {
    marginTop: rhythm(1 / 2),
    marginBottom: rhythm(1 / 2),
    color: '#424242'
  },
  "img": {
      borderRadius: '6px',
  },
  "pre": {
      border: '0.5px solid lightgrey',
  },
  "p": {
      color: '#424242'
  },
  "a": { 
    color: 'rgba(185, 0, 4)'
  },
  "strong": {
    backgroundColor: 'rgba(254, 217, 10, 0.7)'
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