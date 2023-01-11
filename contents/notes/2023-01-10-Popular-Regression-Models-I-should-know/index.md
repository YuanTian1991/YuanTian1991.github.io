---
slug: '/notes/Popular-Regression-Models-I-should-know'
date: '2023-01-10'
title: 'Popular Regression Models I should know'
tags: ['Regression']
abstract: 'When learning the Cousera regression course, I want to have a collection of regression that are commonly used here.'
---

Below is a list given by ChatGPT... What I will do gradually is to fulfill them with a clear and intuitive explaination, some example to refer, and R code to copy-paste.

There are many different types of regression models that can be used depending on the specific characteristics of the data and the research question. Some of the most common models include:

## Linear Regression
This is the most basic type of regression model, in which the relationship between the independent and dependent variables is assumed to be linear. It's commonly used to model a continuous response variable as a linear function of one or more continuous or categorical predictor variables.

## Logistic Regression
This is used when the response variable is binary or categorical, it models the probability of the response variable taking on a specific value using a logistic function.

## Poisson Regression
This is used when the response variable is a count, it models the mean of the count variable using a Poisson distribution.

## Probit Regression
Similar to logistic regression, this is used when the response variable is binary or categorical, but instead of logistic function, it models the probability of the response variable taking on a specific value using a normal cumulative distribution function (probit function)

## Multivariate Adaptive Regression Splines (MARS)
This is a nonparametric method for fitting flexible regression models. It can handle both linear and nonlinear relationships and can be used with both continuous and categorical predictors.

## Fixed Effect Regression
This is a type of regression analysis that is used to estimate the effect of one or more variables on a response variable, while controlling for the effects of other variables that are considered to be "fixed."

## Random Forest
This is an ensemble learning method that builds multiple decision trees and combines their predictions to improve the overall accuracy and stability of the model.

## Gradient Boosting
This is another ensemble method like random forest, but it builds the trees one-at-a-time, where each new tree aims to correct the mistakes of the previous tree.

## Support Vector Regression (SVR)
This method is used when the data has a lot of noise and it tries to find the best fit by maximizing the margin between the target and the prediction.

