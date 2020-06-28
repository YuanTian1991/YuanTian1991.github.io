import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"


import { Paper } from '@material-ui/core';

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark

  return (
    <div className="blog-post-container">
      <Layout>
        <Paper elevation={5} style={{ padding: '3em', backgroundColor: 'rgba(245, 245, 245, 0.4)' }}>
          <h1 style={{ fontWeight: '900' }}>{frontmatter.title}</h1>
          <h4>{frontmatter.date}</h4>
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
      }
    }
  }
`