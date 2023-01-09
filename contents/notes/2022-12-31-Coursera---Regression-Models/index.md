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

For a long time, I only know about the slope, but not very sure about those residuals. Firstly there is a concept here, residuals are in theory, not errors, errors are unobservable among population, thus we use residual as an estimation of error. In most case, the mean of residuals is 0, because we assume in nature, errors are normal distributed.

**Residuals are useful for investigating poor model fit.**

Also, **residuals can be seen as the outcome of Y, with linear association of predictor(X) removed.** This is the principle to use regression to remove the cell type effect. The the coursera, the author said it's very common to use this method, to remove a effect of X, and get the new outcome of Y, which contains other information.

Finally, residual variance somewhat represents the model bias or not. Then, the lecture shows some key figures from residual for regression diagnose.

The R function to get residual is `resid()`.
<br>
Compared with an intuitive solution that draw residual along the line, a better way to draw a plot is like below, which shows the variation of residual along the whole X. Blow are three figures can be used for residual analysis:

<div>
<div style="display:inline-block; width: 30%">

![Regression line Plot](https://raw.githubusercontent.com/bcaffo/courses/master/07_RegressionModels/01_06_residualVariation/assets/fig/unnamed-chunk-1.png)
</div>
<div style="display:inline-block; width: 30%">

![Residual Plot](https://raw.githubusercontent.com/bcaffo/courses/master/07_RegressionModels/01_06_residualVariation/assets/fig/unnamed-chunk-4.png)
</div>
<div style="display:inline-block; width: 30%">

![Scatter Plot](https://raw.githubusercontent.com/bcaffo/courses/master/07_RegressionModels/01_06_residualVariation/assets/fig/unnamed-chunk-10.png)
</div>
</div>


The first one (left) shows us if the regression line match the data well. The second one shows us if the residuals are normal distributed, if not, there could be other hidden patterns inside. The third one shows we how many variants were explained by the current X since the left boxplot is residual against the mean value.


The above figure is a typical normal distributed regression line, which is good. However, in many cases, by using the above residual plot, we can find some pattern indicates there are other patterns in the data. For example, the below figure shows that the apart from regression model, there could have some other model hidden behind the data.

<div style="text-align: center">

![sparsed residual plot](https://raw.githubusercontent.com/bcaffo/courses/master/07_RegressionModels/01_06_residualVariation/assets/fig/unnamed-chunk-8.png)
</div>

So, the above residual come from a code like this:

```R
# The SD of y is larged with larger X.
x <- runif(100, 0, 6); y <- x + rnorm(100, mean = 0, sd = 0.001 * x)
```

A metrics for residual is **residual variation**, which is $\frac{1}{n}\sum_{i=1}^{n}e_{i}^{2}$. It's a metrics to estimate the "nice" of regression model, this value is also called "sigma"($\sigma$). In R, below result can see in `summary()` function.

Then, here comes another important metric, **R Squared**. So what is R2 exactly? It represent the fraction of variability explained by X and explained by Residual (error).

$$
\sum_{i=1}^{n}(Y_i - \bar{Y})^2 = \sum_{i=1}^{n}(Y_i-\hat{Y}_i)^2 + \sum_{i=1}^{n}(\hat{Y}_i - \bar{Y})^2
$$

In the equation, the left represent all the variable each Y have, against the mean Y. The middle part represent $\sigma$, the variant explained by error. And the right side is variant explained by X.

So, in our model, we hope that X could be strongly related with Y, in other word, most of the value variant in Y can be explained by X, thus, the higher fraction of variant explained by X (when compared with explained error), the better. 

The above is an intuitive explanation for R2. And since it's faction, the R2 must be between 0 and 1. Though it looks like the higher R2 is, the better model we get. However, the below figure shows that even totaly wrong and improper regressions can have the same R2 score. Thus, R2 is just one metric, but not the only one we can reply one in regression model assessment.

<div style="text-align: center">

![R2](https://raw.githubusercontent.com/bcaffo/courses/master/07_RegressionModels/01_06_residualVariation/assets/fig/unnamed-chunk-12.png)
</div>

## Inference in Regression