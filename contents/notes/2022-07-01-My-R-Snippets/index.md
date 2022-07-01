---
slug: '/notes/My-R-Snippets'
date: '2022-07-01'
title: 'My R Snippets'
tags: ['R']
abstract: 'Pieces of R code I may need to copy-paste in future work.'
---

## Split string with multiple spliter

Just change/add splitted in `\[spliter]`

```R
strsplit(x, "\\/|\\_| ")
```

## "Multiple" two vectors into data.frame

`outer` function is really cool. It can form two vectors into a dataframe.

```R
> A <- 1:5
> B <- c("A", "B", "C", "D", "E")
> A
[1] 1 2 3 4 5
> B
[1] "A" "B" "C" "D" "E"
> outer(A, B, function(a,b) paste0(a,b))
     [,1] [,2] [,3] [,4] [,5]
[1,] "1A" "1B" "1C" "1D" "1E"
[2,] "2A" "2B" "2C" "2D" "2E"
[3,] "3A" "3B" "3C" "3D" "3E"
[4,] "4A" "4B" "4C" "4D" "4E"
[5,] "5A" "5B" "5C" "5D" "5E"
>
```
