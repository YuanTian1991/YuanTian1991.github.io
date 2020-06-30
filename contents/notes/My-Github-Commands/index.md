---
slug: "/notes/My-Github-Commands"
date: "2020-06-29"
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

### Keep the feature branch up to date

This happens when I am developing a new feature/bug in a feature branch, but I see the main branch has been updated by others. So I need to firstly checkout to main branch, update the main branch, then merge the new-updated main branch to my current-feature branch.


Below is a solution I found online, which works fine, but the merge step cause some conflict for me to solve. And those conflict seems happen on files I did not touched...

```bash
git checkout dev-live
git fetch
git pull --rebase
git checkout myfeature

git merge dev-live 

# Above step cause some conflict on my feature branch.
# After solve those conflict

git add .
git commit -m "Merged Updated Conflict from new dev-live"
```

Then I can continue the Feature/Bug development.

---
## Discard changes to one file

This happens somtimes I modified a lot of files, but eventually found some file is totally unneccesary to be modified. So I want to revoke what I have done to certain one file.

```bash
git checkout -- file
```

---