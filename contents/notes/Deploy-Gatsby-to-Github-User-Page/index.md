---
slug: "/notes/Deploy-Gatsby-to-Github-User-Page"
date: "2020-06-28"
title: "Deploy Gatsby to Github User Page"
tags: ['gatsby', 'github']
abstract: "After sometime of development, I now finished a basic version of note. So then I want to deploy it on my github, I like the idea that using XXXX.github.io for domain name, which looks even better than using a bought domain. So I need to find out how to do it"
---

After development, I want to deploy it on my github domain, in my case, it's https://yuantian1991.github.io/. However, it's kind of special to for user github page. Based on my previous trying, such domain page would directly take html files from the master, so you can't just push your code here.

According the [Gatsby Docs](https://www.gatsbyjs.org/docs/how-gatsby-works-with-github-pages/). There are two ways to do it.
 1. Push the code to another branch, but generate builded file into master branch.
 2. Put the code into another repo, then everytime you need to copy-paste builded static files into user page repo.

 I want to try the first one here, hopefully it works.

---

Firstly I installed a npm library:
```bash
npm install gh-pages --save-dev
```

it would be used to directly push builded static file to master.


Then I created a repo with my name: `YuanTian1991.github.io`. Then `git init`, `git add .`, `git commit -m "Initial Commit"` current project. Then push everything to master branch.

```bash
git remote add origin https://github.com/YuanTian1991/YuanTian1991.github.io.git
git push origin master
```

