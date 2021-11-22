---
slug: '/notes/My-R-Data.Table-Quick-Code'
date: '2021-10-19'
title: 'My R Data.Table Quick Code'
tags: ['R']
abstract: 'Finally I started to use Data.Table, it is really fast and cool. However, learning to use data.table is a bit similar to learn some key functions like aggregate .etc. Here I record a bit my key code.'
---

I started to use [data.table](https://cran.r-project.org/web/packages/data.table/vignettes/datatable-intro.html) when I found base R code can not fulfill my computational purpose. And I like it, I think in the future I will replace all my code with data.table. It may be a bit slow to start using it. However, I hope it will work smoothly in the future.

## 1. Transfer data.frame to data.table

Assume I have a data.table as below, the `cl` column in the table is the index used to "collapse" data:

```R
library("data.table")

CNT.dt <- setDT(CNT.df) # data.frame to data.table

CNT.df <- as.data.frame(CNT.dt) # data.table to data.frame
```

## 2. Aggregate function

This is a key reason I use data.table.

```R
> RegionCollapse
                             chr start   end   pos     NC_cnt NC_ocp
       1:                   chr1 10922 10972 10947  0.1613736      1
       2:                   chr1 10972 11022 10997  0.6423164      1
       3:                   chr1 11022 11072 11047  0.1613736      1
       4:                   chr1 11072 11122 11097 -0.3090061      1
       5:                   chr1 11122 11172 11147  0.1822201      3
      ---
39065421: chrY_KI270740v1_random 36374 36424 36399 -0.3090061      0
39065422: chrY_KI270740v1_random 36424 36474 36449 -0.3090061      1
39065423: chrY_KI270740v1_random 36648 36698 36673 -0.3090061      1
39065424: chrY_KI270740v1_random 36947 36997 36972 -0.3090061      0
39065425: chrY_KI270740v1_random 36997 37047 37022 -0.3090061      0
          NC_fraction     TC_cnt TC_ocp TC_fraction      LT_cnt LT_ocp
       1:   0.1428571 0.04391415      0   0.0000000 -0.04849291      0
       2:   0.1428571 0.04391415      0   0.0000000 -0.04849291      0
       3:   0.1428571 0.04391415      0   0.0000000 -0.04849291      0
       4:   0.1428571 0.04391415      0   0.0000000 -0.04849291      0
       5:   0.4285714 0.04391415      0   0.0000000 -0.04849291      0
      ---
39065421:   0.0000000 0.04391415      0   0.0000000 -0.04849291      1
39065422:   0.1428571 0.04391415      0   0.0000000  1.40105038      0
39065423:   0.1428571 0.04391415      0   0.0000000 -0.04849291      0
39065424:   0.0000000 0.04391415      2   0.2857143 -0.04849291      0
39065425:   0.0000000 0.58206031      1   0.1428571 -0.04849291      0
          LT_fraction     cl
       1:   0.0000000      1
       2:   0.0000000      1
       3:   0.0000000      1
       4:   0.0000000      1
       5:   0.0000000      1
      ---
39065421:   0.3333333 372600
39065422:   0.0000000 372600
39065423:   0.0000000 372600
39065424:   0.0000000 372600
39065425:   0.0000000 372600
>
```

It's easy to do, just put `cl` in the third comma, then we can modify columns as much as we want. It's really fast, compared with troditional aggregate function.

```R
RegionAggre <- RegionCollapse[, .(chr[1], min(start), max(end),
                                .N,
                                mean(NC_cnt),
                                mean(TC_cnt),
                                mean(LT_cnt),
                                sum(NC_fraction >= 0.75),
                                sum(TC_fraction >= 0.75),
                                sum(LT_fraction >= 0.75)), by = .(cl)]
```

> Note that I have not find a way to dynamically set columns into function, that's why in above code, I have to write `sum(NC_fraction >= 0.75)`, `sum(NC_fraction >= 0.75)` ... one by one. I think there must be a way. I will udpate this part later.

## 3. Create new column

This is a very good feature. The `:=` operation do the job. Below example added one more column from just created string.

```R
CNT.dt[, "peakID" := paste0("peakID_", 1:nrow(CNT.dt))]
```
Below example added one more column by calculate mean position of a region (start and end).
```
CNT.dt[, "pos" := (start + end)/2]
```

## 4. cbind two data.table

In below code, I selected couple columns from each data.table, and cbind them togather **into a data frame**.

```R
AvgPeaks.dt <- cbind.data.frame(CNT.dt[,c("chrom", "start", "end", paste0(phenos, "_cnt")), with = FALSE],
                                Occupancy.dt[,c( paste0(phenos, "_ocp"),  paste0(phenos, "_fraction")), with = FALSE])
```

If you want to merge two data.table into one data.table, "key" is a must thing for two data.tables. It seems you can specify one columns as key, but I think it's a good idea to always have a key in each data.table. So it's more similar to SQL table.

```R
CNT.dt[, "peakID" := paste0("peakID_", 1:nrow(CNT.dt))]
Occupancy.dt[, "peakID" := paste0("peakID_", 1:nrow(Occupancy.dt))]

setkey(CNT.dt, peakID) # Unexpectively, this step is a bit slow, take 20 seconds in my 39,065,425 matrix
setkey(Occupancy.dt, peakID)

AvgPeaks.dt <- merge(CNT.dt[,c("peakID", "chrom", "start", "end", paste0(phenos, "_cnt")), with = FALSE],
                     Occupancy.dt[,c("peakID",paste0(phenos, "_ocp"),  paste0(phenos, "_fraction")), with = FALSE])
```

## 5. Remove columns from data.table

```R
CNT.dt[, c("peakID") := NULL]
```

## 6: Row calculation

One limitation for data.table is to do row calculation. The way to do it (dynamically) is to subset columns, then do data.frame function, then added new created column(s) into data.table. The **.SDcols** and **.SD** are two reserved word, that will select only columns needed for calculation. Then the .SD is a normal data.frame for any action. For example, in my case, I select columns, then use matrxStats for row-Mean calculation.

```R
phenos <- c("NC", "TC", "LT")

CNT.dt <- setDT(CNT)
for(i in phenos) {
    message("Averaging ", i, ' ...')
    CNT.dt[, (paste0(i, "_cnt")) :=  matrixStats::rowMeans2(as.matrix(.SD)), .SDcols=grep(i, colnames(CNT.dt))]
}

Occupancy.dt <- setDT(Occupancy)
for(i in phenos) {
    message("Calculate Occupancy Fraction ", i, ' ...')
    tmpN <- length(grep(i, colnames(Occupancy.dt)))
    Occupancy.dt[, (paste0(i, "_ocp")) :=  matrixStats::rowSums2(as.matrix(.SD)), .SDcols=grep(i, colnames(Occupancy.dt))]
    Occupancy.dt[, (paste0(i, "_fraction")) :=  .SD/tmpN, .SDcols=paste0(i, "_ocp")]
}
```

## 6: Update subset of column

This situation happen if I want to just update part of one column, for example only a column show TRUE or FALSE.

```R
tmpTable[strand == "+", strand := "F"]
tmpTable[strand == "-", strand := "R"]
```