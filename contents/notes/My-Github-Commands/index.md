---
slug: "/notes/My-Github-Commands"
date: "2020-06-29"
title: "My Github Commands"
tags: ['github']
abstract: "For many years, I merely only use commands like git add, git commit, git push .etc. Now I am colaborating with more and more professional people on Github. So I want to record a bit my commands learned here. It's not systemic, but maybe a quick cheatsheet."
---

Here I just record my handy commands, not full-power git manual. As I guess I can't remember them all, so some essential one accumulated list would be perfect for me.


## 1. Abandon all my current changes
Happend when I wrote couple lines, then find this is the correct branch.

```bash
git reset --hard HEAD
```

It would remove all add/delete I have done, to the latest commit.

## 2. Checkout new branch from current
Open a bug/feature branch based on current one (for example dev-live), after fixing bugs/features, I will merge this bug/feature branch to main (current) one.

```bash
git checkout -b FEATURE dev-live
```

Another solution is, **after you are on the correct current verison branch**, run below command. I prefer the first one.

```bash
git checkout -b FEATURE
```

## 3. Keep the feature branch up to date

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

## 4. Discard changes to one file

This happens somtimes I modified a lot of files, but eventually found some file is totally unneccesary to be modified. So I want to revoke what I have done to certain one file.

```bash
git checkout -- file
```

## 5. Rename a Local branch

This happens when I created a branch, but later I don't like the name. In most case, it's because I fixed many issues in it.

```bash
git branch -m currentBranchName newBranchName
```

## 6. Replace a Branch completelyl with Another

This happens when I pushed and merged a branch, say `SolveIssues`, to master. Then I want to continue solve more issues, then I want to also use the same name `SolveIssues`. However, if I blindly merge, sometimes conflict would happen. So the best way here is to directly rewrite SolveIssues Branch with the master branch, then continue developing.

```bash
git checkout SolveIssues
git reset --hard maste
```

## 7. Copy changes in one or more commit in one branch into another

This happens a lot to me when I update ChAMP package, I need to modify the master branch first, then checkout into RELEASE_3_XX branch, then do the modifications again, by typing! So I think there must be a way to do it, which is `cherry-picking`.

Assuming I am have modified branch master, and committed something into Github. Now I should firstly get the commit ID of these changes, with below command:
```bash
git log --oneline -3
```
Then I found the two commits I want to cherry-pick:

```bash
ff261fe (HEAD -> master, upstream/master, origin/master, origin/HEAD) Removed Valid Checking in champ.runCombat(), Combat now take factors with even one sample.
7223d10 Fixed bug of missing blc function, removed counfouding checking in champ.runCombat.R
9a0b89a bump x.y.z version to odd y following creation of RELEASE_3_12 branch
```

Then I checkout to another branch, say RELEASE_12 here, cherry-pick these two commit with code:

```bash
git cherry-pick 7223d10 ff261fe -n
```

Then the changes I did in commit 7223d10 ff261fe will all be copied into this branch, but not committed (because of the `-n` parameter above), which is exactly what I need. Note that sometimes there may be conflict when cherry-picking, just solve them, then recommit.

## 8. Fetch/Pull a remote branch to local for development

This happens when I need to fetch a remote branch which was not exist in my local computer for development. I did not found better way, so here I record a stupid way:

```bash
git fetch
git checkout remote_new_branch
```