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

Then change the key name as below: `/Users/tian/.ssh/BathLinux

```bash
tian@Yuans-Mac-mini ~ $ ssh-keygen -t ed25519
Generating public/private ed25519 key pair.
Enter file in which to save the key (/Users/tian/.ssh/id_ed25519): /Users/tian/.ssh/BathLinux
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
```

Then copy the content of `BathLinux.pub` to a file named `authorized_keys` in `~/.ssh`. If this file not exist, just create it.

Then modify `config` file in `~/.ssh` folder, add below information:

```bash
Host BathLinux
  HostName linux.bath.ac.uk
  User ty456
  ForwardX11Trusted yes
  IdentityFile ~/.ssh/BathLinux
```

That's it, not I can login Aantra as:

```bash
ssh BathLinux
```

If I need to SSH twice. I need to create another ssh key named: `AnatraFromMacMini`. Then write as below:

```bash
Host Anatra
    Hostname anatra.bath.ac.uk
    ProxyJump ty456@BathLinux
    User ty456
    ForwardX11Trusted yes
    IdentityFile ~/.ssh/AnatraFromMacMini
```

So, now I can log into Anatra directly as `ssh Anatra`

## 8. Find recursively then create soft link

This is particularly useful when I get a folder contain recursive files, then I need to "falt" them for software input.

```bash
find /scratch1/folder -name "*.fq.gz" -exec ln -s {} ./ \;
```

In above command, I search folder to recursively find `.fq.gz` file, then create a link for each of them (`{}`) to current folder.

## 9. Sync only new or modified files

```bash
rsync -avz  --progress ./oldFolder /data3/newFolder
```

## 10. Find and delete all folder created by certain user in one folder

In `/tmp` folder, there are many folders, some are created by certain user (for example, tian), then I want to only delete folder created by me. So I need to firstly find out what folders are created by me, then delete them. In below find command. I firstly set `-maxdepth 1` to only search for one layer. Then I define `-type d` for only directory. Thirdly, I define `-user tian` to find folders created by me. Then delete them with -exec command.

```bash
find ./ -maxdepth 1 -type d -user tian -exec rm -rf {} \;
```