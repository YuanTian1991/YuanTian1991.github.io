---
slug: "/notes/Gatsby-get-current-url-pathname"
date: "2020-06-28"
title: 'Gatsby Get Current Url Pathname'
tags: ['gatsby']
abstract: "I want to make layout title show different font-size based on pages. For example, show a larger font in note list page, but a small button in blog page."
---

Sometimes I want to show different content based on different url link. For example, in [this website](https://yuantian1991.github.io/). My logo and title would be larger, but if in any post page, they would be smaller. The key here is to "identify" related url link. After searching on internet, I found a quick way to do it, which at least works for gatsby static website.

For example, in `layout.js` file, which is located in /src/components folder. Under `render`:

```javascript
render() {
  const { classes } = this.props;
  const url = typeof window !== 'undefined' ? window.location.pathname : '';

  return (
  ...
```

Then this url could be used in returned part, for example, to decide what code to show.

```javascript
<Typography
  variant={url === '/' ? 'h2' : 'h5'}
  className={classes.title}>
  Yuan Tian
</Typography>
```

Then it works, only on home page, my name would show `h2` dom, but would show `h4` font-size in other note pages.

<!-- ![gatsby-remark-prismjs](./test.png) -->