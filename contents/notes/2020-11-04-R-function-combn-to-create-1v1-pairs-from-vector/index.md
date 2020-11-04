---
slug: '/notes/R-function-combn-to-create-1v1-pairs-from-vector'
date: '2020-11-04'
title: 'R function combn to create 1v1 pairs from vector'
tags: [R]
abstract: 'A very useful R function to generate pairs from a list of options, suitable for automatically pair-wise comparision work.'
---

It's common that sometimes we have a list of phenotype, say: Cancer, Normal and Metastasis. Then we want to compare them 1v1, so we need to generate pairs for each two of them.

I found R function `combn` is super suitable for this work. Below is an example. It automatically generated AC-TC, AC-LCNEC, TC-LCNEC for me from a `unique(pheno)` function.

```R
> head(pheno)
[1] "AC" "TC" "TC" "TC" "TC" "TC"
> table(pheno)
pheno
   AC LCNEC    TC
   31    23    98
> combn(unique(pheno),2)
     [,1] [,2]    [,3]
[1,] "AC" "AC"    "TC"
[2,] "TC" "LCNEC" "LCNEC"
>
```

After that, we can iterate them in loop.