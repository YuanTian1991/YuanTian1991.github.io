import React, { useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { Paper, Container, Divider, Typography, Chip } from "@material-ui/core"

import SEO from "../components/seo"

import "katex/dist/katex.min.css"

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const classes = useStyles()
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark

  useEffect(() => {
    console.log(frontmatter)
  }, [])

  return (
    <div className="blog-post-container">
      <Layout>
        <SEO title={frontmatter.title} />
        <Container maxWidth="md">
          {/* <Paper elevation={1} style={{ padding: '2em', backgroundColor: 'rgba(245, 245, 245, 0)' }}> */}
          <span style={{ marginTop: "1em", marginBottom: "0px" }}>
            {frontmatter.date}
          </span>
          <h1
            style={{
              fontSize: "2.2em",
              // fontWeight: "700",
              marginTop: "0.2em",
              marginBottom: "0.4em",
            }}
          >
            {frontmatter.title}
          </h1>

          {frontmatter.tags !== undefined &&
            frontmatter.tags.map((tag, tagIndex) => {
              return (
                <Chip
                  size="small"
                  key={tagIndex}
                  label={<code className={classes.sideChipLabel}> {tag}</code>}
                  variant="outlined"
                  style={{
                    margin: "5px",
                    marginBottom: "1em",
                    fontSize: "14px",
                    backgroundColor: "white",
                  }}
                />
              )
            })}

          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          {/* </Paper> */}
        </Container>
      </Layout>
    </div>
  )
}
export const pageQuery = graphql`
  query ($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        tags
        abstract
      }
    }
  }
`

const useStyles = makeStyles(theme => ({
  sideChipLabel: {
    fontSize: "1em",
    backgroundColor: "rgb(255,255,255, 0)",
    color: "#757575",
    fontWeight: "100",
    fontFamily:
      "'Menlo', 'Monaco', 'Andale Mono', 'Ubuntu Mono', 'SFMono-Regular', monospace",
  },
}))
