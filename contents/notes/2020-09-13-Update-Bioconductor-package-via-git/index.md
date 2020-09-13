---
slug: '/notes/Update-Bioconductor-package-via-git'
date: '2020-09-13'
title: 'Update Bioconductor package via git'
tags: ['github', 'ChAMP']
abstract: 'Since I am maintaining ChAMP, constantly I need to update some programs, add features and similar staff. I have been using new git-based Bioconductor system for a while, here I am just record some codes for check.'
---

## 1. Clone the Master code
Use the command to get latest package, which should be online.

```
$ git clone https://github.com/YuanTian1991/<YOUR-REPOSITORY>.git
```

Then, link the package upstream to Bioconductor, then after your modification, you can push your code to Bioconductor.
```
$ git remote add upstream git@git.bioconductor.org:packages/<YOUR-REPOSITORY>.git
```

## 2. Add remote upstream
Then we may use `git remote` command to check:
```
tianyuan@tianyuan-ThinkPad-X240:~/Work/ChAMP-Issue/Updates/ChAMP$ git remote -v
origin	https://github.com/YuanTian1991/ChAMP.git (fetch)
origin	https://github.com/YuanTian1991/ChAMP.git (push)
upstream	git@git.bioconductor.org:packages/ChAMP.git (fetch)
upstream	git@git.bioconductor.org:packages/ChAMP.git (push) 
```
Above print shows the package has been successfully linked to Bioconductor, thus we may push upstream to it latter.

## 3. Check and Merge version.
In many cases, I have not modify code for quite a long time, while Bioconductor version goes up as 3.6, 3.7, 3.8... each updating on Bioconductor would bump a version up. For exmaple, my current version if 2.11.5, while Bioconductor 3.9 (master) is already 2.13.0. In this case, I need to `fetch` latest upstream code from Bioconductor, to make sure my code is latest with Bioconductor:

Say we are going to modify `master` verison first:

1. Make sure you are on the appropriate branch.
```
 git checkout master
```
2. Fetch content from Bioconductor
```
git fetch upstream
```
3. Merge upstream with the appropriate local branch
```
git merge upstream/master
```
Push changes to GitHub’s (origin) master branch
```
git push origin master
```
After doing this, my git repo (master branch) has the same version as Bioconductor, then we can continue our development.

## 4. Modify the Code.
Personally, I already modify code in another version, because latter we need to change two version online here: Bioconductor development version, and current version. They will be switched by checkout command.

## 5. Push online for Master branch
Say now we are in master branch. I normally git one version down and remove the .git folder, and do modification on it. Say it's in a folder called "modified". After modification, I can directly copy the whole documents to the master branch, then `git add .`, `git commit -m "..."`, then firstly push to my github:

```
git push origin master
```
Then push upstream to Bioconductor:
```
git push upstream master
```

## 6. push online for current version
Here we need to see if you have already current version exist in your github. For example, if you missed current version (RESEASE_3_8), you need to use below code to create a local version from Bioconductor:
```
git checkout -b RELEASE_3_8 upstream/RELEASE_3_8
```
Or, if you have, you can directly checkout to RELEASE_3_8 as
```
git checkout RELEASE_3_8
```
Again, copy files in modified to cover local file. Then push up to RELEASE_3_8:
```
git push origin RELEASE_3_8
```
```
git push upstream RELEASE_3_8
```
That's it, all fixed.