import Typography from "typography";
import IrvingTheme from 'typography-theme-irving'

IrvingTheme.overrideThemeStyles = ({ rhythm }, options) => ({
  "h1,h2,h3,h4,h5,h6": {
    color: 'black',
    marginTop: "0.5em",
    marginBottom: '0.5em',
  },
  "img": {
      borderRadius: '6px',
  },
  "pre": {
      border: '0.5px solid lightgrey',
  },
  "p": {
      color: 'black',
          marginTop: "0.5em",
    marginBottom: '0.5em',
  },
  "a": { 
    color: '#00b2ca'
  },
  "strong": {
    // backgroundColor: 'rgba(254, 217, 10, 0.7)'
}
});

const typography = new Typography(
//   {
//     baseFontSize: '18.5px',
//     baseLineHeight: 1.666,
//     headerFontFamily: ['Helvetica Neue','Avenir Next', 'Helvetica Neue', 'Segoe UI', 'Arial', 'sans-serif'],
//     bodyFontFamily: ['Helvetica', 'Avenir Next', 'Helvetica Neue', 'Segoe UI', 'Arial', 'sans-serif'],
//     headerColor: 'blue',
//   },
  IrvingTheme
);

export default typography;