---
slug: '/notes/Solve-Bugs:-C++14-standard-requested-but-CXX14-is-not-defined'
date: '2020-11-10'
title: 'Solve Bugs: C++14 standard requested but CXX14 is not defined'
tags: [R]
abstract: 'I updated my Bioconductor to 3.12, then reinstalled all my pacakge (so sad...). However, ChAMP pacakge reported error that sparseMatrixStats failed to install because if this error.'
---

This error is not very normal, here I record a bit how to solved it. The error shows below message, and happens when I install `sparseMatrixStats` pacakge.

```
C++14 standard requested but CXX14 is not defined
```

After google around, the solution seems to be: 

## 1. install gcc and g++ (>8 version)

Don't be hurry to install, because maybe they are already installed, just can't be found by R, try use command to check if they are already avaliable. In my case they are already exist. Note that the version should be above 8.

```bash
gcc --version
g++ --version
```

If you are sure the system did not install proper version gcc/g++, install it yourslef, my command maybe outdated, so maybe google how to install latest verion gcc/g++ is a good idea.

```bash
sudo yum group install "Development Tools"
```

Some other say below command work, I did not try:

```bash
sudo yum install centos-release-scl
sudo yum install devtoolset-8-gcc*
```

## 2 compose `~/.R/Makevars` file

After installation, find the location of g++, in my case:

```bash
$ which g++
/usr/local/bin/g++
```

Then in the home directory, open `~/.R/Makevars` file, add below content

```bash
CXX14FLAGS=-O3 -march=native -mtune=native -fPIC
CXX14=/usr/local/bin/g++
```

Retry install, it works both for sparseMatrixStats or ChAMP