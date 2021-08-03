---
slug: '/notes/My-Shell-Commands'
date: '2020-07-27'
title: 'My Shell Commands'
tags: ['Shell']
abstract: 'This is just a simply post to record some of my commonly used bash script. So that I can copy paste quickly.'
---

## 1. Open/Withdraw Access to another User

This happens everytime I change my UCL password, then I lost access to our lab server. So a quick way to do it, is create a tmp account, then I continue work on that account, until the main account fixed. So during this time, I need to always give access of folders to the tmp account, then withdraw it couple weeks later.

to give access to public


```bash
chmod 777 FEM_13/
```

to withdraw it:

```bash
chmod 755 FEM_13/
```

**This is a bad implementation, as `777` opens the folder to everyone, I should find a better way some day.**

##  2. Change File Ownership

This happens when I take back the fold access, and want to get all file modified by my another account.

```bash
sudo chown -R regmtyu Polish_Cohort_11/
```

## 3. Find and copy files with certain postfix

This happens when I want to found out a list of files recursively in a folder, then copy them into another places.

```bash
find . -type f  -iname "*cpg.txt.gz" -exec cp {} ../../Data/5mC/ \;
```

## 4. Grep recursively for a specific file type on Linux

A good answer from [this post](https://stackoverflow.com/questions/22224719/grep-recursively-for-a-specific-file-type-on-linux?noredirect=1&lq=1).

```bash
grep -r --include="*.[R]" "NC49" .
```