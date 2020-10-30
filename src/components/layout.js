import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


import { Container, Box, Toolbar, Paper, Grid, Typography, CardHeader, Avatar } from '@material-ui/core';
import { Link } from "gatsby"
import StickyFooter from "./footer.js"

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: [
        // { label: "Notes", url: "/" },
        // { label: "Posts", url: "/Posts" },
        // { label: "Pieces", url: "Pieces" },
        { label: "Mountain!!", url: "/Mountain" },
        // { label: "About", url: "/About" }
      ]
    };
  }


  render() {
    const { classes } = this.props;
    const url = typeof window !== 'undefined' ? window.location.pathname : '';

    return (
      <Container maxWidth="lg">
        <Box my={1} >
          <Toolbar className={classes.toolbarSecondary}>

                <div className={classes.root}>
                  {/* <Paper elevation={0} >
                    <img alt="Tian" className={classes.smallTitleIcon} src={require("../assets/image/Tian.jpg")} />
                  </Paper> */}
                  <Link
                    to='/'
                    className={classes.Link}
                  >
                    <Paper elevation={0} >
                      <h4>Tian</h4>
                    </Paper>
                  </Link>
                </div>
            <div className={classes.toolbarButtons}>
              {/* <Avatar size="large" style={{ position: "absolute", padding: '0.2em' }}></Avatar> */}
              {/* <img className={classes.imageIcon} src={Mountain} /> */}

              {/* <Icon classes={{ root: classes.iconRoot }}>
               
              </Icon> */}
              {/* {this.state.sections.map((section, index) => (
                <Link
                  key={index}
                  to={section.url}
                  className={classes.Link}
                >
                  <h5 className={classes.toolbar}>{section.label}</h5>
                </Link>
              ))} */}
            </div>
          </Toolbar>
        </Box>

        <Container maxWidth="md">
        <main>{this.props.children}</main>
        </Container>
        {/* <Copyright /> */}
        <StickyFooter />
      </Container>
    );
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired
};

const styles = theme => ({
  toolbarSecondary: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbarButtons: {
    marginLeft: 'auto',
  },
  Link: {
    textDecoration: "none",
    color: 'black',
    "&:hover ": {
        color: 'black',
    }
  },
  title: {
    color: "black",
    fontWeight: "900",
    cursor: 'pointer'
  },
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  toolbar: {
    paddingRight: theme.spacing(3),
    cursor: 'pointer'
  },
  smallTitleIcon: {
    marginTop: '1em',
    width: 50, height: 50, borderRadius: 50 / 2,
  },
  TitleIcon: {
    // marginRight: '1em',
    width: 60, height: 60, borderRadius: 60 / 2
  },
  imageIcon: {
    position: "absolute",
    padding: '0.2em',
    // top: "0.5em",
    bottom: '-2em',
    right: '2em',
    height: '5em',
    width: '5em',
    // boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
  },
  verticalAlign: {
    backgroundColor: `rgba(245, 245, 245, 0)`,
    display: `flex`,
    justifyContent: `center`,
    alignItems: `center`,
    height: '0em',
  }
});

export default (withStyles(styles)(Layout))