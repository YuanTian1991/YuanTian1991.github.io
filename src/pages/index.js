import React from "react"
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Typography, Box, Paper } from '@material-ui/core';
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
// import Image from "../components/image"
import SEO from "../components/seo"

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    console.log(this.props)
  }

  render() {
    const { classes, data } = this.props;

    return (
      < Layout >
        <SEO title="Note" />
        {
          data.allMarkdownRemark.edges.map(({ node }, index) => {
            return (
              <Link key={index} to={node.frontmatter.slug} style={{ textDecoration: "none", }}>
                <Paper key={index} elevation={0} className={classes.root}>
                  <Box my={1}>
                    {/* <Typography variant="h4" component="h1" style={{ fontWeight: "700" }} gutterBottom> */}
                    <h2 style={{fontWeight: '700', marginBottom: '0.2em'}}>
                      {node.frontmatter.title} </h2>
                    {/* </Typography> */}

                    <Typography  style={{ fontWeight: "100", fontSize: '0.9em', color: 'gray', margin: '0px 0px' }}>
                      {node.frontmatter.date}
                      {
                        node.frontmatter.tags.map((tag, tagIndex) => {
                          return (
                            <span key={tagIndex}>
                              {' | '}
                              <span
                              // className={classes.tag}
                              >{tag}</span>
                            </span>
                          )
                        })
                      }
                    </Typography>

                    <p style={{ fontWeight: "300", fontSize: '1em'}}>
                        {node.frontmatter.abstract}
                    </p>

                    {/* <Typography style={{fontWeight: '300', fontSize: '0.7em'}}>
                      {node.frontmatter.abstract}
                    </Typography> */}
                  </Box>
                </Paper>
              </Link>
            )
          })
        }
      </Layout >
    );
  }
}

IndexPage.propTypes = {
  classes: PropTypes.object.isRequired
};

const styles = theme => ({
  root: {
    // minWidth: 275,
    padding: '1em',
    margin: '0.5em',
    // marginBottom: '2em',
    cursor: 'pointer',
    backgroundColor: 'rgba(255, 0, 0, 0)',
    "&:hover": {
      backgroundColor: 'rgba(0, 0, 0, 0.07)',
      // backgroundColor: 'whitesmoke',
      "-webkit-transition": "background-color 100ms linear",
      "-ms-transition": "background-color 100ms linear",
      "transition": "background-color 100ms linear",
    }
  },
  tag: {
    fontFamily: "consolas",
    padding: '0.1em 0.5em',
    // border: '0.5px solid lightgrey',
    borderRadius: '0.1em',
    cursor: 'pointer',
    "&:hover": {
      backgroundColor: "lightgrey",
      // color: 'white',
      "-webkit-transition": "background-color 500ms linear",
      "-ms-transition": "background-color 500ms linear",
      "transition": "background-color 500ms linear",
    }
  }
});


export const pageQuery = graphql`
{
  allMarkdownRemark(
    sort: { order: DESC, fields: [frontmatter___date] }
    limit: 1000
  ) {
    edges {
      node {
        frontmatter {
          title
          slug
          date(formatString: "MMMM DD, YYYY")
          tags
          abstract
        }
      }
    }
  }
}
`

export default (withStyles(styles)(IndexPage))
