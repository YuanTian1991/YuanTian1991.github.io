---
slug: '/notes/Coursera---Regression-Models'
date: '2022-12-31'
title: 'Coursera - Regression Models'
tags: ['Coursera', 'Regression', 'R']
abstract: 'Regression is am important tool that I should have dug into years ago. Here are just some key notes I write done during my learning with the Coursera course Regression Model.'
---

I am following the [Regression Model Course on Coursera](https://www.coursera.org/learn/regression-models). This note is just a collection of high-dense knowledge I absorbed from the course, and my understanding/key-code .etc. A super-mini summary. Also, One book I should read along with the course is [this one](https://leanpub.com/regmods) (maybe later one day 😅), which can be freely downloaded.

Why we still need to learn regression in nowadays where machine learning (ML) is surging up? One key advantage of regression against machine learning is the highly interpretable model fits.

## Some types of Regressions

Three common concepts: **Least Squares Regression (LSR)**, **Multivariable Regression (MVR)** and **Generalized Linear Models (GLM)**. The difference between them is subtle: 

* `Least Squares Regression` seems most commonly represents the situation fitting one dependent variable (y) with one independent variable (x) with a **straight line**. The key is to find the minium residual (quite intuitive). I personally think this principle also works even if we have multiple x, however, according to some posts like [this](https://www.real-statistics.com/multiple-regression/least-squares-method-multiple-regression/) and [this](https://stats.stackexchange.com/a/2363), if there are multiple x but only one y in a Least Squares Regression, it should be called as "Multiple Regression"...
* `MultiVariable Regression` seems to represent the situation that there are multiple dependent and 1-N independent variables, when compared with the Multiple Regression concept above. 
* `Generalized Linear Models` seems like it could represent other models more than straight lines, for example, $y = b_1x_1^2 + b_2x_2*3...$. According to ChatGPT, GLM does not require data distributions, normalisation .etc, which I am not sure about yet...

---

To be continued...