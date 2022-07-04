---
slug: '/notes/Complex-ggplot2:-Line-Plot'
date: '2022-07-04'
title: 'Complex ggplot2: Line Plot'
tags: ["R", "ggplot2"]
abstract: 'Here are some nice plot I draw with ggplot2, for copy and paste in the future'
---

## 1. Line plots with groups and annotation

In below code, there are two data frame to prepare, `df` and `pValues`. The `pValues` contains annotation I want to label on each figure. And all figures are separated by `facet_wrap`. 

The `Days` column in pValues data.frame is a must, however, it just need to randomly assign a value in `Days` column in df. The `newGroup` need to be matched between two data.frame.

```R
> head(df)
                  discount cumNumber cumFraction           group   Days Item
book-£10-10Days.1        1         1  0.01219512 book-£10-10Days 10Days book
book-£10-10Days.2        2         1  0.01219512 book-£10-10Days 10Days book
book-£10-10Days.3        3         4  0.04878049 book-£10-10Days 10Days book
book-£10-10Days.4        4        10  0.12195122 book-£10-10Days 10Days book
book-£10-10Days.5        5        16  0.19512195 book-£10-10Days 10Days book
book-£10-10Days.6        6        17  0.20731707 book-£10-10Days 10Days book
                  Price newGroup
book-£10-10Days.1   £10 book £10
book-£10-10Days.2   £10 book £10
book-£10-10Days.3   £10 book £10
book-£10-10Days.4   £10 book £10
book-£10-10Days.5   £10 book £10
book-£10-10Days.6   £10 book £10
>
> pValues
              label       showPvalue  x    y          newGroup  Days
1          book £10 P value=1.16e-16 30 0.25          book £10 5Days
2          book £30 P value=4.71e-19 30 0.25          book £30 5Days
3 pair of shoes £30 P value=2.31e-14 30 0.25 pair of shoes £30 5Days
4 pair of shoes £60 P value=6.64e-18 30 0.25 pair of shoes £60 5Days
5      speaker £150 P value=3.51e-16 30 0.25      speaker £150 5Days
6       speaker £30 P value=1.06e-17 30 0.25       speaker £30 5Days
>
```

```R
p <- ggplot(df, aes(x=discount, y=cumFraction, group=Days)) +
     geom_line(aes(color=Days), size=1.2) +
     geom_text(data=pValues, aes(x=x, y=y, label=showPvalue))+
     facet_wrap(~newGroup) +
     scale_color_manual(values=c("#6c6c6c", "#4ab7ff", "#ff0200")) +
     labs( x="Discount", y = "Willingness to Accept") +
     theme_bw(base_size=18) +
     theme(legend.position="top", legend.title=element_blank())
```

Below is a code to print it into a PDF

```R
pdf("DeliveryTimeInOnePlot.pdf", width=12, height=8)
print(p)
dev.off()
```