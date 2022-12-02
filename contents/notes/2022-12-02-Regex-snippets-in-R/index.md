---
slug: '/notes/Regex-snippets-in-R'
date: '2022-12-02'
title: 'Regex snippets in R'
tags: ['R', 'Regex']
abstract: 'My R regex collections, will be expensively used in daily work.'
---

## Detect if a certain pattern exist in a string

[stringr](https://stringr.tidyverse.org/reference/str_detect.html) is a very good package for this task.

* The `[.]` is important.

```R
> library("stringr")
> str_detect("Logs/Logs/Cycles//XXX_Cycle1.00.log", "_Cycle1[.]")
[1] TRUE
```

## Extract between two strings

This is so commonly used, and every time I have to re-google. A good way I found is to use [qdapRegex package](https://cran.r-project.org/web/packages/qdapRegex/index.html). A very cool thing here is that it does not to deal with special characters like .

```R
> library("qdapRegex")
> ex_between("Logs/Logs/Cycles//XXX_Cycle1.00.log", "_Cycle", ".log")
[[1]]
[1] "1.00"
> ex_between("Logs/Logs/Cycles//XXX_Cycle1.00.log", "//", "_")
[[1]]
[1] "XXX"
> ex_between("Logs/Logs/Cycles//XXX_Cycle1.00.log", "_Cycle", ".log", include.markers = TRUE) # A parameter to keep the two side strings.
[[1]]
[1] "_Cycle1.00.log"
```

## Split string
Another commonly used functionality. I used to use strsplit, but recently I found something much better - [word](https://stringr.tidyverse.org/reference/word.html).

This function is really cool.
* The second and third parameters decide part of the string you want to extract after splitting by the sep.
* It can be done reversibly. By setting start/end to -1.

```R
> library("stringr")
> word("_Cycle1.00.log", start = 1, sep="[.]")
[1] "_Cycle1"
# or
#
> word("_Cycle1.00.log", start = 1, end=2, sep=fixed("."))
[1] "_Cycle1.00"
# Reversely
# 
# In the below example it will start from the second-last string part after split (00), and end with the last string after split (log), paste them together and return.
> word("_Cycle1.00.log", start=-2, end=-1, sep=fixed("."))
[1] "00.log"
```

