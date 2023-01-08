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

## Basic Notions

**Empirical Variance**: The equation for variant is $S^2 = sum((x - mean)^2) / n$, while **empirical variance** is $S^2 = sum((x - mean)^2) / (n - 1)$. They are so similar but not exactly the same. And there is "empirical standard deviation" as $S$. According to the lecture, SD is better to be used them normal variance, as variance represent the squared value of the data.

**Centering**: For a group of data, each value subtracts the mean value. $ X_{centering} = X_i - \bar{X}$. So after centring, their mean value is 0.

**Scaling**: For a group of data, each value divide by the SD. $X_{scaling} = X_i / S$. So the "scaled" data will have SD as 1.

**Normalisation**: For a group of data, substract the mean, then devide by SD, we can new data with 0 as mean and 1 as SD. equation is this $X_{normalisation} = (X_i - \bar{X})/S$. A good and simple way to understand normalised data is: If a data value is 2 after normalisation, this value is twice larger than the mean value in the original data. One value important functionality of normalisation is to make non-comparable data comparable.

> I guess normalisation is the most useful tool. Maybe worth looking up the different usage of centering, scaling and normalisation one day.

**Empirical Covariance**: $Cov(X, Y) = \frac{1}{n-1}\sum_{n=i}^{n}{(X_i - \bar{X})(Y_i - \bar{Y})}$. Intuitively, it means for two matched list, if $X_i$ is large, $Y_i$ is large, then their multiply would be positively very large. In another word, the two lists of data shall have the same "trend" up or down.

**Correlation:** $Cor(X, Y) = \frac{Cov(X, Y)}{S_xS_y}$. I thinks is the "scaled" version of Covariance, since it has been restricted into -1 and 1, so any two list of data (no matter what data range) can be used to find correlation status.

> In R, correlation function is `cor(x, y)`, and covariance function is `cov(x, y)`. I think I actually never use the covariance function at all...


## The famous linear Least Squares

The most famous and commonly used regression, I intuitively understand the principle of this regression method, which is to minimize below euqation:

$$
\displaystyle\sum_{i-1}^{n}{(Y_i - (B_0 + B_1X_i))^2}
$$

This is so important and easy to understand. Also, importantly, this equation also should works for higher dimensions, like 3 or more variables, by minimise the difference between real value $Y_i$ and "model predicted value" $(B_0 + B_1X_i)$. For simple two-variable regression, there is already equation for final result below:

$$
\hat{B_1} = Cor(Y, X) \frac{SD(Y)}{SD(X)}
$$


In the course, I just know that:

1. It represents that the slope ($B_1$) has the unit of $Y/X$, for example, you regression house-price with car-price, their unit varis a lot initially (Millions to Thousand), but still the regression will work, because **the slope contains the difference between the two units. In another word, the slope represent the increment of unit of Y, when 1 unit of X increased.**

2. Centering will not change the regression result, because centering just change the mean, not the SD, and slope is decided by the SD (difference between unit).

3. If we do normalisation for both X and Y, then do regression, both two new data have 0 as mean and 1 and SD, the slope would not be the original one, instead it will be the $Cor(Y, X)$. Intuitively, I can understand that after normalisation, both two data list are around 0 point, and with same SD, thus the slope we can estimate then just represent some changing of angles between them...

> The regression function for R is `lm(y ~ x)`, by default it includes a intercept. Then we use `summary` or `coef` function to get slopes.
> In ggplot2, to code to add regression line into plot is `g + geom_smooth(method="lm", formula=y~x)`

## Residuals

For a long time, I only know about the slope, but not very sure about those residuals. Firstly there is a concept here, residuals are in theory not errors, errors are unobservable among population, thus we use residual as an estimation of error.


