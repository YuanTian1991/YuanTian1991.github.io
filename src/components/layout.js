import React from "react"
import { makeStyles } from "@material-ui/core/styles"

import {
  Container,
  Box,
  Toolbar,
  Paper,
  Grid,
  Typography,
  CardHeader,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem
} from "@material-ui/core"
import { Link } from "gatsby"

import SubjectTwoToneIcon from '@material-ui/icons/SubjectTwoTone';

import StickyFooter from "./footer.js"

export default function Layout(props) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null);
  const url = typeof window !== "undefined" ? window.location.pathname : ""

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Container maxWidth="lg">
    <Box my={1}>
      <Toolbar className={classes.toolbarSecondary}>
        <Grid container spacing="1" alignItems="center">
          <Grid item>
            {" "}
            <Link to="/" className={classes.Link}>
              Tian
            </Link>
          </Grid>
        </Grid>

        <div className={classes.toolbarButtons} style={{width: '100px'}}>
        <IconButton onClick={handleClick}>
          <SubjectTwoToneIcon style={{fontSize: '1em'}} />
        </IconButton>
        <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style={{marginTop: '2.2em', zIndex: 1000}}

      >
        <MenuItem 
        onClick={handleClose} 
        style={{fontSize: '0.75em', height:30}} 
        component={Link}
        to={"https://yuantian1991.github.io/Travel/"}>Tian&Yi's TravelMap</MenuItem>
        {/* <MenuItem 
        onClick={handleClose} 
        style={{fontSize: '0.75em', height:30}} 
        component={Link}
        to={"https://mountainwestie.com/"}>Mountain my dog</MenuItem>
        <MenuItem 
        onClick={handleClose} 
        style={{fontSize: '0.75em', height:30}} 
        component={Link}
        to={"/life-in-month"}>Life in Month</MenuItem> */}
        <MenuItem 
        onClick={handleClose} 
        style={{fontSize: '0.75em', height:30}}
        component={Link}
        to={"https://yuantian1991.github.io/crc-igv/#/"}
        >CRC-IGV</MenuItem>
      </Menu>
          
        {/* <Link to="/life-in-month" className={classes.Link} style={{fontWeight: '300', fontSize: '0.75em'}}>
              Life in Month
            </Link> */}
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

    <main>{props.children}</main>
    {/* <Copyright /> */}
    <StickyFooter />
  </Container>
  )
}

const useStyles = makeStyles(theme => ({
  toolbarSecondary: {
    // borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbarButtons: {
    marginLeft: "auto",
  },
  Link: {
    textDecoration: "none",
    color: "black",
    fontWeight: "bold",
    "&:hover ": {
      color: "black",
      textDecoration: "none",
    },
  },
  title: {
    color: "black",
    fontWeight: "900",
    cursor: "pointer",
  },
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  toolbar: {
    paddingRight: theme.spacing(3),
    cursor: "pointer",
  },
  smallTitleIcon: {
    marginTop: "1em",
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
  TitleIcon: {
    // marginRight: '1em',
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
  },
  imageIcon: {
    position: "absolute",
    padding: "0.2em",
    // top: "0.5em",
    bottom: "-2em",
    right: "2em",
    height: "5em",
    width: "5em",
    // boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
  },
  verticalAlign: {
    backgroundColor: `rgba(245, 245, 245, 0)`,
    display: `flex`,
    justifyContent: `center`,
    alignItems: `center`,
    height: "0em",
  },
}))
