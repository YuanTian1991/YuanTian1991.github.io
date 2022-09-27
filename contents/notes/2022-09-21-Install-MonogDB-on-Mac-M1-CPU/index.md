---
slug: '/notes/Install-MonogDB-on-Mac-M1-CPU'
date: '2022-09-21'
title: 'Install MonogDB on Mac M1 CPU'
tags: ["MongoDB"]
abstract: 'I never thought it is so hard to install a mongoDB on Mac. It took me over one hour to figure out. Here are some steps and records I can follow in the future.'
---

I need to install MongoDB to continue my development on [GCGR platform](http://gcgr.org.uk/). Since I recently changed my computer, now I am working on a latest M1 CPU MacBook Pro. I was intended the mongoDB to install it on my computer. However, most instructions I followed are not working...including [the official one](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/).

Eventually I found this [post](https://linuxhint.com/install-mongodb-mac-m1/) really works.

Firstly I need to install [Homebrew](https://brew.sh/), by following defaul instructions.

Then below are key commands:

1. Download the official homebrew formula

```shell
brew tap mongodb/brew
```

2. Run updates 
```shell
brew update
```

3. Install mongoDB, note that here **I previous tried 6.X version, which is not working, but eventually seems this 4.4 version works for me**.

```shell
brew install mongodb-community@4.4
```

After this command, there will be some output, like this:

```
If you need to have mongodb-community@4.4 first in your PATH, run:
  echo 'export PATH="/opt/homebrew/opt/mongodb-community@4.4/bin:$PATH"' >> ~/.zshrc
```

So do as the instruction do, the `mongo` command is in it.

That's it, the installation is done. Below are 3 key command to start/stop/restart mongoDB in Mac:

```shell
brew services start mongodb-community@4.4

brew services stop mongodb-community@4.4

brew services restart mongodb-community@4.4
```

After starting, below command can be used to check if the mongoDB is started:

```shell
$ brew services list
Name                  Status  User File
mongodb-community@4.4 started tian ~/Library/LaunchAgents/homebrew.mxcl.mongodb-community@4.4.plist
```

After everything is done, I can successfully conncect the mongoDB with the [MongoDB Compass](https://www.mongodb.com/products/compass).

---

Above are steps I followed and actually worked for installation of MongoDB on Mac, I guess in the future I need to also write similar thing for Linux or other version of Mac .etc, 😂