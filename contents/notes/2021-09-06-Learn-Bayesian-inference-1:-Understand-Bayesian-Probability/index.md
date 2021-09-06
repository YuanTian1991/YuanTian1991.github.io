---
slug: '/notes/Learn-Bayesian-Inference-1:-Understand-Bayesian-Probability'
date: '2021-09-06'
title: 'Learn Bayesian Inference 1: Understand Bayesian Probability'
tags: ['Bayesian']
abstract: 'For a long time, I want to learn Bayesian Inference, finally it is a start here. First lesson is better understand Bayesian Probability'
---

So it's a start to learn Bayesian Inference. My utimate goal is to apply Bayesian Inference in my genomic analysis work. Previously I read some papers like [Recursively partitioned mixture model clustering in DNA Methylation research](https://bmcbioinformatics.biomedcentral.com/articles/10.1186/1471-2105-9-365), and they looks so cool. In nowadays that multi-omic data is avaliable, Bayesian Inference may be a way to get more causal inference.

I am starting with [this book](https://nbviewer.jupyter.org/github/CamDavidsonPilon/Probabilistic-Programming-and-Bayesian-Methods-for-Hackers/tree/master/), the Chinese version. However, I have a feeling that this books is not enough, so some additional material will be merged into my study. For example, I find [this webpage](https://www.mathsisfun.com/data/bayes-theorem.html) is really good.

## 1. Bayesian Probability

Bayesian Probability is such a basic thing in statistic. Many people (like me) roughtly know the "battle" between Bayesian and Probability. And we roughtly there is a "a bit" complex equation for nearly all Bayesian statistic. 

$$
P(A\mid X) = \frac{P(X\mid A)P(A)}{P(X)}
$$

In which, $P(A)$is the probability $A$ happen. $P(X)$is the probability $X$ happen. **$P(A\mid X)$ is the probability that $A$ happen when $X$ happen**. There are many examples to explain this equation in [this post](https://www.mathsisfun.com/data/bayes-theorem.html). (By the way, the story in the book is not very good to me). In short, this equation provides us a solution to estimate the probability that something happen when certain condition pre-exist.

In above equation, all numbers are matters. $P(A)$, $P(X)$ or the rest. It could be explained by people's gut feeling with information. If a Prophet say he "generally" have an 90% accurate on prediction, then he predict end of the world will come in 10 days, would it really come? I think the answer is we don't know if we use Bayesian way, because we don't know $P(A)$, which means the probability that the end of the world would really come. Then, another Prophet say, I predict in next ten days, the end of the world will NOT come, people would still not be intereseted in it, because the end of the world would very unlikely to come in next ten days. **In other word, if $P(A)$ is too large or small, there is no point to predict.**

## 2. Covid Positive Example

If we take Covid detection as an example. If someone is detected positive $X=1$, how likely he really get Covid ($P(A\mid X)$)? To get this answer, we need all above numbers on the right of equation.

* $P(A)$ : the general number of Covid happen in sociaty. Accoring two NHS number today, in UK there are 7018927 total have/had covid detected, so the this number is 7018927/60,000,000 = 0.1169821. 60M is roughly UK's population. However, this number is much lower in China, in China there are much fewer cases, and much bigger population. So, Covid behaivor indeed help here.

* $P(X\mid A)$ : The chance that when people are indeed Covid, the detection method successfully find he is positive. This is a number related to all kinds of detection method, PCR, IGM .etc In other word, we want this number as high as possible. Accoring to [this post](https://www.cochrane.org/CD013705/INFECTN_how-accurate-are-rapid-tests-diagnosing-covid-19), this number is 83% for Covid positive accurate.

* $P(X)$ : The total chance that a detection is positive. This number means, the probability that a test is positive, in our case, it means the sum of **People positive and Detection Positive** and **People Negative and Detection Positive (False Discovery)**. Apprarently, a good detection method should be able to find positive patients, and avoid to find people who are healthy. Also, accoring to [this post](https://www.cochrane.org/CD013705/INFECTN_how-accurate-are-rapid-tests-diagnosing-covid-19), the false discovery rate is 0.06. So we calculate $P(X) = 0.117 * 0.83 + (1-0.117) * 0.06$, which is 0.15.

So if someone is detected positive, the chance he really is positive is:

$$
P(A\mid X) = \frac{0.83 * 0.117}{0.15} = 0.6474
$$

So this is my answer. **However, in practice, all above numbers are very hard to get right.** For example, in [a statement of NHS](https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/895843/S0519_Impact_of_false_positives_and_negatives.pdf), 98.4% of tests are negative for daily NHS result, which seems imply that we should use this number as $P(A)$, if so, the final result is 0.9988259, which is quite hight. So, which number we should use as $P(A)$? I don't know. Also, how to esimtate the sensitivity (accurate) of PCR test? There are already a couple paper out there to discuss this question, and I don't think there will be a clear answer... That's it, in our human world, even if you get the correct equation, you may not get the most accurate parameter.