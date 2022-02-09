import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import { Link } from "gatsby"

export default function Copyright() {
  const classes = useStyles();

  return (
    <div style={{ paddingTop: '3em', paddingBottom: '3em', textAlign: 'center' }}>
      <Container style={{marginBottom: '1em', fontSize: '0.8em', cursor: "pointer"}}>
        <Link to="/RevolverMaps" className={classes.button}>Stats</Link>
      </Container>

      <p variant="body2" color="textSecondary" align="center" style={{fontSize: '0.8em'}}>
        {'Copyright © '}
          Yuan Tian
          {' '}
        {new Date().getFullYear()}
        {'.'}
      </p>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  button: {
    // minWidth: 275,
    padding: '0.5em',
    margin: '0.5em',
    borderRadius: '5px',
    // marginBottom: '2em',
    textDecoration: 'none',
    color: 'hsla(0,0%,0%,0.8)',
    fontWeight: '400',
    cursor: 'pointer',
    backgroundColor: 'rgba(255, 0, 0, 0)',
    "&:hover": {
      backgroundColor: 'rgba(0, 0, 0, 0.07)',
      fontWeight: '400',
      "-webkit-transition": "background-color 100ms linear",
      "-ms-transition": "background-color 100ms linear",
      "transition": "background-color 100ms linear",
      "-webkit-transition": "font-weight 100ms linear",
      "-ms-transition": "font-weight 100ms linear",
      "transition": "font-weight 100ms linear",
    }
  }
}));