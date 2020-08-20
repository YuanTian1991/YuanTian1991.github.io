---
slug: '/notes/Install-R-and-reinstall-Packages'
date: '2020-08-19'
title: 'Install R and reinstall Packages'
tags: ['R']
abstract: 'It is absolute a nightmare to install R, and R package. Nor to say in this world there are some packages as horrible as my ChAMP... Every year basically I need to install a newer version R, and reinstall packages...'
---

So, now the R 4.0.2 is coming... I need to update it on the server, and reinstall all packages on it. Then I can finally start working.

## R 4.0.2 Installation

After download and `tar zxvf`, it's the key step: **Configuration**, there are so so many parameters in it. In theory just `./configure` should work, but in practic, it's never works on my side, not even once...There are always some missing libraries, some missing libs, and even after everything is done, you can find your R can not open web browser, can not generate HTML .etc... A lot of problems.

Firstly, I tried...

```bash
./configure --prefix=/Data/Tian/Software/install/R_4.0.2 --exec-prefix=/Data/Tian/Software/install/R_4.0.2 --enable-R-shlib
```

As expected, not working. The error is:
```bash
configure: error: libcurl >= 7.28.0 library and headers are required with support for https
```

After searching across the website, the way seems is to install `curl` library in a folder, then tell R to find it there...

Firstly I created a folder `mylib` beside the current folder, then enter it, try install latest curl directly.

```bash
# Install curl in my local folder, which should requires no sudo authority

wget https://curl.haxx.se/download/curl-7.72.0.tar.gz
tar zxvf curl-7.72.0.tar.gz
mkdir mycurl
cd curl-7.72.0
./configure  --prefix=/Data/Tian/Software/mylib/mycurl
make && make install
```

After a while, I can see the `curl` has been installed into `mycurl` folder:
```
(base) regmtyu@SLMSICANBECK01:/Data/Tian/Software/mylib/mycurl$ ls
bin  include  lib  share
```

Then, let me retry the command, add the curl path at the end:

```bash
./configure --prefix=/Data/Tian/Software/install/R_4.0.2 \
            --exec-prefix=/Data/Tian/Software/install/R_4.0.2 \
            --enable-R-shlib \
            LDFLAGS="-L/Data/Tian/Software/mylib/mycurl/lib" \
            CPPFLAGS="-I/Data/Tian/Software/mylib/mycurl/include"
```

Then it works. If I miss more other library, I can continue to add them to the folder and the path. Now, I can `make && make install` to finish the installation.

Then modify the R/Rscript in my bin folder, make them my default choice.
```bash
# in /Data/Tian/Software/bin folder

rm R
rm Rscript
ln -s ../install/R_4.0.2/bin/R
ln -s ../install/R_4.0.2/bin/Rscript
```

Finally, in my home directory, create a file called `.Renviron`:
```
TMP = "/Data/Tian/myTMP"
R_LIBS_USER=/Data/Tian/Software/install/R_4.0.2/lib64/R/library
```

The first line indicates if R is about to create some tmp, where should it download it. **The second line indicates where to install packages**. I don't want to put everything in my Home Directory.

---

## Install Packages

Then, I think I need a script to install all packages. So the steps are simply: 1, get package names from old installed R, 2, install in new R.

```R
if (!requireNamespace("BiocManager", quietly = TRUE))
    install.packages("BiocManager")

# below is the key code
installList <- setdiff(dir("/Data/Tian/Software/install/R_3.6.0/lib64/R/library"), dir("/Data/Tian/Software/install/R_4.0.2//lib64/R/library"))

BiocManager::install(installList)
```

Then I want to go to sleep, just leave it running...