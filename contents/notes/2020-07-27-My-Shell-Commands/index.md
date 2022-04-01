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

Similarlly, below code can move correponding files to target folder:

```bash
find . -name "*AAA*" -exec mv {} target/path \;
```

## 4. Grep recursively for a specific file type on Linux

A good answer from [this post](https://stackoverflow.com/questions/22224719/grep-recursively-for-a-specific-file-type-on-linux?noredirect=1&lq=1).

```bash
grep -r --include="*.[R]" "NC49" .
```

## 5. Copy certain file and their folder structure

This command is used when I need to only extract R script from a series of folders, and copy them all into another folder for saving.

```bash
find . -name '*.R' -exec cp --parents \{\} ../GithubBackup/BathCRC/ \;
```

## 6. Kill all process by certain user

Normally `sudo` is not used here.

```bash
sudo killall -u ubuntu
```

## 7. Create SSH key for Server Login

Firstly create a ssh key.

```bash
ssh-keygen -t ed25519
```

Then change the key name as below: `/Users/tian/.ssh/Anatra`

```bash
tian@Yuans-Mac-mini ~ $ ssh-keygen -t ed25519
Generating public/private ed25519 key pair.
Enter file in which to save the key (/Users/tian/.ssh/id_ed25519): /Users/tian/.ssh/Anatra
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
```

Then copy the content of `Anatra.pub` to a file named `authorized_keys` in `~/.ssh`. If this file not exist, just create it.

Then modify `config` file in `~/.ssh` folder, add below information:

```bash
Host Anatra
  HostName linux.bath.ac.uk
  User ty456
  ForwardX11Trusted yes
  IdentityFile ~/.ssh/Anatra
```

That's it, not I can login Aantra as:

```bash
ssh Anatra
```