---
slug: '/notes/R-Tip-My-ggplot2-Plots-Code'
date: '2020-07-12'
title: 'R Tip: My ggplot2 Plots Code'
tags: ['R', 'ggplot2', 'visualisation']
abstract: 'This is a note to record my quick code to draw comparaibily nice figure with ggplot2.'
---

I used to only use pure R code to draw plots, it's not bad, but ggplot2 indeed do much better than I do. But it's not very easy to remember code from ggplot2. So here I record a bit code I used. Or better, form them into functions or even a small personal use R visualisation package in the future.

### Histogram

For example, histogram could be used to check p value quickly.

```r
library('ggplot2')

#head(DEG$pvalue)

#[1] 7.459678e-33 5.611091e-31 5.081911e-23 4.894006e-21 1.068582e-20
#[6] 1.921252e-20

ggplot(DEG, aes(x=pvalue)) + geom_histogram() + theme_minimal() + labs(title="p value histogram")
```

![P value Histogram](./fig1.png)