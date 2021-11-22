import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Box, Paper, Grid, Chip, Avatar } from '@material-ui/core';
import { Link, graphql, navigate } from "gatsby"
import Layout from "../components/layout"
// import Image from "../components/image"
import SEO from "../components/seo"

const useStyles = makeStyles((theme) => ({
  root: {
    // minWidth: 275,
    padding: '1em',
    margin: '0.5em',
    // marginBottom: '2em',
    cursor: 'pointer',
    backgroundColor: 'rgba(255, 0, 0, 0)',
    "&:hover": {
      backgroundColor: 'rgba(0, 0, 0, 0.07)',
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
  },
  sideChipLabel: {
    fontSize: '1em', 
    backgroundColor: 'rgb(255,255,255, 0)', 
    color: '#757575', 
    fontWeight: '100',
    fontFamily: "'Menlo', 'Monaco', 'Andale Mono', 'Ubuntu Mono', 'SFMono-Regular', monospace",
  },
  sideChipLabelActive: {
    fontSize: '1em', 
    backgroundColor: 'rgb(255,255,255, 0)', 
    color: 'white', 
    fontWeight: '900',
    fontFamily: "'Menlo', 'Monaco', 'Andale Mono', 'Ubuntu Mono', 'SFMono-Regular', monospace",
  }
}));

export default function IndexPage(props) {
  const classes = useStyles();
  const [tagCount, setTagCount] = useState([])
  const [selectedTag, setSelectedTag] = useState([])

  useEffect(() => {
    let tags = []
    props.data.allMarkdownRemark.edges.forEach(element => {
      element.node.frontmatter.tags.forEach(tag => {
        tags.push(tag)
      })
    });
    function count(arr) {
      return arr.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {})
    }
    tags = count(tags)
    let tagCount = Object.keys(tags).map((key) => {
      return({tag:key, count: tags[key]})
    });

    tagCount.sort(function (a, b) {
      return b.count - a.count;
    });
    console.log(tagCount)

    setTagCount(tagCount)
    
  }, [])

  const handleSelectTag = (tag) => {
    if(!selectedTag.includes(tag)) {
      const newTagList = [...selectedTag, tag]
      setSelectedTag(newTagList)
    } else {
      const newTagList = [...selectedTag]
      var index = selectedTag.indexOf(tag);
      newTagList.splice(index, 1);
      setSelectedTag(newTagList)
    }
  }

  const handlePageClick = (page) => {
    navigate(page)
  }

  return (
    < Layout >
    <SEO title="Tian's blog" />
    <Grid container spacing={2}>
        <Grid item xs={9}>
        {
      props.data.allMarkdownRemark.edges.map(({ node }, index) => {
        if(selectedTag.length === 0 || selectedTag.some(r=> node.frontmatter.tags.indexOf(r) >= 0)) {
          return (
            // <Link key={index} to={node.frontmatter.slug} style={{ textDecoration: "none", }}>
              <Paper key={index} elevation={0} className={classes.root}
              onClick={() => handlePageClick(node.frontmatter.slug)}
              >
                <Box my={1}>
                  <h2 style={{ marginBottom: '0.1em', marginTop: '0'}} className={classes.title}>
                    {node.frontmatter.title} </h2>
                  <Typography  style={{ fontWeight: "100", fontSize: '0.85em', color: 'gray', padding: '10px 0px 0px 0px'}}>

                    {node.frontmatter.date}

                    {
                      node.frontmatter.tags.map((tag, tagIndex) => {
                        return (
                          <Chip 
                          size="small" 
                          key={tagIndex} 
                          label={                          
                          <code
                          className={selectedTag.includes(tag) ? classes.sideChipLabelActive : classes.sideChipLabel}
                            // style={}
                            >{tag}
                            </code>} 
                          variant={selectedTag.includes(tag) ? "default": 'outlined'}
                          style={{zIndex: 9999,margin: '0px 5px 3px 5px', fontSize: '13px', backgroundColor: selectedTag.includes(tag) ? "hsla(0,0%,0%,0.8)": "white"}} 
                          onClick={(e) => {
                            e.stopPropagation(); 
                            handleSelectTag(tag)
                    }}
                          />
                        )
                      })
                    }
                  </Typography>
                  <p style={{ fontWeight: "400", fontSize: '0.9em'}}>
                      {node.frontmatter.abstract}
                  </p>
                </Box>
              </Paper>
              // </Link>
          )
        }


      })
    }
        </Grid>
        <Grid item xs={3}>
          {
            tagCount.map((tag, index) => {
              return(
                <Chip 
                size="small" 
                key={index} 
                label={                          <code
                  className={selectedTag.includes(tag.tag) ? classes.sideChipLabelActive : classes.sideChipLabel}
                  // style={}
                  >{tag.tag}
                  </code>} 
                variant={selectedTag.includes(tag.tag) ? "default": 'outlined'}
                avatar={<Avatar style={{fontSize: '10px', color: 'white', fontWeight: '700'}}>{tag.count}</Avatar>}
                style={{margin: '5px', fontSize: '13px', backgroundColor: selectedTag.includes(tag.tag) ? "hsla(0,0%,0%,0.8)": "white"}} 
                onClick={() => handleSelectTag(tag.tag)}
                />
              )
            })
          }
        </Grid>
        </Grid>

  </Layout >
  );
}


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
