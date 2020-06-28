---
slug: "/notes/My-Github-Commands"
date: "2020-06-28"
title: "My Github Commands"
tags: ['github']
abstract: "For many years, I merely only use commands like git add, git commit, git push .etc. Now I am colaborating with more and more professional people on Github. So I want to record a bit my commands learned here. It's not systemic, but maybe a quick cheatsheet."
---

Here I just record my handy commands, not full-power git manual. As I guess I can't remember them all, so some essential one accumulated list would be perfect for me.

---

### Abandon all my current changes
Happend when I wrote couple lines, then find this is the correct branch.

```bash
git reset --hard HEAD
```

It would remove all add/delete I have done, to the latest commit.

---

### Checkout new branch from current
Open a bug/feature branch based on current one (for example dev-live), after fixing bugs/features, I will merge this bug/feature branch to main (current) one.

```bash
git checkout -b FEATURE dev-live
```

Another solution is, **after you are on the correct current verison branch**, run below command. I prefer the first one.

```bash
git checkout -b FEATURE
```

---