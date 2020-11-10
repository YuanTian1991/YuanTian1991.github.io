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
        {/* <Paper elevation={2} style={{ padding: '2em', backgroundColor: 'rgba(245, 245, 245, 0)' }}> */}
          <p style={{ marginTop: '1em', fontWeight: '100' }}>{frontmatter.date}</p>
          <h1 style={{ fontSize: '1.8em' , fontWeight: '500' }}>{frontmatter.title}</h1>
          {/* <Container style={{padding: '1.5em'}}>
              <Container style={{padding: '1em',
                                 backgroundColor: 'rgba(0, 0, 0, 0.05)', 
                                }}>
                    <small style={{fontWeight: '100', fontSize: '0.9em', color: '#616161'}}>
                        {frontmatter.abstract}
                    </small>
            </Container>
            <Divider style={{marginTop: '1em', marginBottom: '1em'}}/>
          </Container> */}
          <Divider style={{marginTop: '1em', marginBottom: '1em', color: 'white'}}/>
          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        {/* </Paper> */}
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