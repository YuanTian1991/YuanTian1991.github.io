---
slug: '/notes/My-Shell-Commands'
date: '2020-07-27'
title: 'My Shell Commands'
tags: ['shell']
abstract: 'This is just a simply post to record some of my commonly used bash script. So that I can copy paste quickly.'
---

## Open/Withdraw Access to another User

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