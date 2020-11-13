import Typography from "typography";
import githubTheme from 'typography-theme-github'

githubTheme.overrideThemeStyles = ({ rhythm }, options) => ({
  "h1,h2,h3,h4,h5,h6": {
    color: 'hsla(0,0%,0%,0.9)',
    marginTop: "0.8em",
    marginBottom: '0.8em',
    lineHeight: '1.3',
  },
//   "img": {
//       borderRadius: '6px',
//   },
//   "pre": {
//       border: '1px solid lightgrey',
//   },
//   "p": {
//       color: 'black',
//           marginTop: "0.5em",
//     marginBottom: '0.5em',
//     lineHeight: "1.6",
//   },
//   "a": { 
//     color: '#00b2ca'
//   },
//   "strong": {
//     // backgroundColor: 'rgba(254, 217, 10, 0.7)'
// }
});

const typography = new Typography(
//   {
//     baseFontSize: '18.5px',
//     baseLineHeight: 1.666,
//     headerFontFamily: ['Helvetica Neue','Avenir Next', 'Helvetica Neue', 'Segoe UI', 'Arial', 'sans-serif'],
//     bodyFontFamily: ['Helvetica', 'Avenir Next', 'Helvetica Neue', 'Segoe UI', 'Arial', 'sans-serif'],
//     headerColor: 'blue',
//   },
  githubTheme
);

export default typography;