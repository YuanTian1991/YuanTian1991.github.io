import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"


import { Paper, Container, Divider, Typography } from '@material-ui/core';

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark

  return (
    <div className="blog-post-container">
      <Layout>
        <Paper elevation={5} style={{ padding: '4em', backgroundColor: 'rgba(245, 245, 245, 1)' }}>
          <p style={{ marginBottom: '2em', fontWeight: '100' }}>{frontmatter.date}</p>
          <h1 style={{ fontWeight: '900' }}>{frontmatter.title}</h1>
          <Container style={{padding: '1.5em'}}>
              <Container style={{padding: '1em',
                                 backgroundColor: 'rgba(0, 0, 0, 0.06)', 
                                }}>
                    <Typography variant="body1" style={{fontWeight: '100'}}>
                        {frontmatter.abstract}
                    </Typography>
            </Container>
            <Divider style={{marginTop: '1em', marginBottom: '1em'}}/>
          </Container>
          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Paper>
      </Layout>
    </div>
  )
}
export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        abstract
      }
    }
  }
`