---
slug: '/notes/Develop-Gatsby-on-Kindle-Browser'
date: '2021-02-19'
title: 'Develop Gatsby on Kindle Browser'
tags: ["Kindle", "Gatsby"]
abstract: 'Previously I have tested that Gatsby works for Kindle. Now the problem is how can I develop it? I do not want to deploy my code on Github page everytime. Finally I found Gatsby Serve works for Kindle.'
---

What I want to do is find a way for me to develop kindle browser, I previously tested [Gatsby website works for Kindle Browser](https://yuantian1991.github.io/notes/Kindle-Browser-access-Gatsby-and-React-Github-page), not I want to find a way to develop on it. Normally when we do website development, we open the editors like VScode, then whenever we save the code after done some modification, the web page would be refreshed. Sadly, Kindle Browser can't do it automatically. After searching a bit, I found a way that I can open Mac's port, and use Nginx as proxy, to allow Kindle to access 80 port on my Mac.

## 1. Open firewall and find your IP address

Firstly I need to open the firewall for Mac, which is located in `Security & Privary` of system setting. There is a firewall option, which could be openned. Also, you should be able to see **your IP address**∂ in `Network` of system setting.

## 2. Configure Nginx

I installed nginx (which may have been pre-installed). I know there are many artical online who use homebrewer to install Nginx, but I don't know why it's not working for me. On the contrary, the system included a nginx, located in /usr/local/bin/nginx, which works for me. So I did not install it actually.

Start nginx with below code, it would inform you that it's openned.
```
sudo nginx
```

Secondly, I need to modify the nginx file, which is located in /usr/local/etc/nginx/nginx.conf, just modify the `proxy_pass`, change it to your own website localhost port, nothing else should be changed:

```
...
    server {
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            proxy_pass   http://127.0.0.1:9000; # Just change here to the port.
        }
...
```

Then reload Nginx as:

```bash
sudo nginx -s reload
```

Finally we can check nginx status, to make sure it's working properly on Mac. It should returns you a lot of things, but if nginx is not working, it should return an error.
```bash
curl http://your.ip.address
```

To stop nginx, use below command:
```bash
sudo nginx -s stop
```

## 3. Gatsby website need to be build and served

Above are settings for nginx. After setting above. Now I need to make Gatsby works, I found that after my coding, the way to make Kindle Browser work is to firstly build the website, with command:
```bash
gatsby build
```
Then serve it with command:
```
gatsby serve
```
This is the most simple way to serve a Gatsby website, surely you can set up a backend like Express, but this is easier but indeed works. Then the website would be served in localhost:9000. That's why previously I set nginx config as 9000. Now your mobile phone or kindle browser should be able to access http://your.ip.adress. to check the result.

So still it's not very convinient, but after some coding, I can build and serve it a bit, then use Kindle to check if things work on Kindle.