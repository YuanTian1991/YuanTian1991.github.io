---
slug: '/notes/Send-Email-in-R-with-mailR'
date: '2021-10-05'
title: 'Send Email in R with mailR'
tags: ["R"]
abstract: 'In many cases we may want to send email with R. For example, running a super long program, we want to have a remind email after finishing. Or like me, want to create website with R backend that automatically do some work. Based on my test, mailR is one solution.'
---

It's cool and useful to allow R to send email, but I found it's not that easy to set up the environment. Here I am using [mailR](https://cran.r-project.org/web/packages/mailR/index.html) package. There are indeed some steps to follow to get it running...

## 1. Install Java and mailR package

Firstly this package relies on Java, so I need to install Java in my Ubuntu system:

```bash
apt install -y default-jre
apt install -y default-jdk
```

After above installation, if you already have R installed, try to config Java environment like:

```bash
R CMD javareconf # Configure Java
```

After above step, you can install mailR:

```R
install.packages("mailR")
```

## 2. Download dependences and modify security

Then it will still not working, because some Java library seems missing, I found the solution from [here](https://stackoverflow.com/a/55418571). **You need to enter the mailR library location, download two dependence packages below**. Im my case (Ubuntu 20), the location is: /usr/local/lib/R/site-library/mailR/java

```bash
cd /usr/local/lib/R/site-library/mailR/java
wget https://repo1.maven.org/maven2/javax/activation/javax.activation-api/1.2.0/javax.activation-api-1.2.0.jar
wget https://repo1.maven.org/maven2/com/sun/activation/javax.activation/1.2.0/javax.activation-1.2.0.jar
```

Then, in some case you need to unblock your system's TLSv1 and TLSv1.1 setting: enter /usr/lib/jvm/java-11-openjdk-amd64/conf/security folder, modify **java.security** file, remove TLSv1 and TLSv1.1. I can't rememebr where I found this solution...
```
jdk.tls.disabledAlgorithms=SSLv3, TLSv1, TLSv1.1, RC4, DES, MD5withRSA, \
    DH keySize < 1024, EC keySize < 224, 3DES_EDE_CBC, anon, NULL, \
    include jdk.disabled.namedCurves
```

## 3. Write R function

After you done all these above, now we can start to write a small R function to send email, like below. Note that the email SMTP setting must be in accord with your email, you need to google it out. And these email **CAN NOT** have security settings like two-step verification. You have to disable it to make everything work. It may makes your email weak. So in my case, I registered a new email for specifically deal with my "programming email".

```R
library(mailR)

NoticeEmail <- function(Title, Message) {
  send.mail(from = "XXXX@gmail.com",
            to = "others@email.com",
            subject = Title,
            body = Message,
            smtp = list(host.name = "smtp.gmail.com", port = 587,
                        user.name = "XXXX@gmail.com",
                        passwd = "myPassword",
                        ssl = TRUE),
            authenticate = TRUE,
            send = TRUE)
}
```

The way to run it is like below, easy to use, so everytime I have a big function running. I can just copy page below two lines into stalled R session. Like 

```r
source("./NoticeEmail.R")
NoticeEmail(" XXX Program Finished Title", "XXX Programe success/fail.")
```