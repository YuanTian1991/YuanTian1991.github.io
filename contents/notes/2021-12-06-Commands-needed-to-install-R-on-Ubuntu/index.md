---
slug: '/notes/Commands-needed-to-install-R-on-Ubuntu'
date: '2021-12-06'
title: 'Commands needed to install R on Ubuntu'
tags: ['R']
abstract: 'It is always hard to install R in linux, in compile way... Here are some quick code I recorded to install R on Ubuntu system.'
---

Mostly inspired by this [gist](https://gist.github.com/ElToro1966/999f1c8ca51a75648dd587a3170e4335). But I don't want base R, so below are just some key commands needed.


1. Install key dependence
```bash
sudo apt install gdebi libxml2-dev libssl-dev libcurl4-openssl-dev libopenblas-dev
```

2. Looks like Java, or maybe for PDF extraction tools as the author said
```bash
sudo apt install libpoppler-cpp-dev default-jre default-jdk r-cran-rjava
```

3. TTF/OTF fonts usage
```bash
sudo apt install libfreetype6-dev
```

4. For Cairo for graphic devices
```bash
sudo apt install libgtk2.0-dev libxt-dev libcairo2-dev
```

5. For HTML webpage compile
```bash
sudo apt-get install texinfo
```

6. For error neither inconsolata.sty nor zi4.sty found
```bash
sudo apt -y install texlive-latex-recommended texlive-pictures texlive-latex-extra
or
sudo apt-get install texlive-fonts-extra
```

Then, download latest version R from [here](https://cran.r-project.org/src/base/R-4/). unzip and configure it as:
```bash
./configure --prefix=/home/tian/Software/install/R-4.1.2 --exec-prefix=/home/tian/Software/install/R-4.1.2
```
Then, check if all warning/error are addressed. Then `make` and `make install`.