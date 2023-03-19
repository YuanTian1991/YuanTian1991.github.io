---
slug: '/notes/Work-with-SQLite-with-R-or-Shell'
date: '2023-03-19'
title: 'Work with SQLite with R or Shell'
tags: ["SQLite", "R", "Shell"]
abstract: 'In my work I sometimes want to create a light-weight database, and compared with databases like PostgreSQL or MongoBD, SQLite is really a good choice. Here I record some key code I use to interactive with SQLite in R or Shell.'
---

## Save R Table into SQLite

Below R code is quite useful to insert data to sqlite.

```r
install.packages("RSQLite")
library(RSQLite)

con <- dbConnect(RSQLite::SQLite(), "path/to/mydatabase.sqlite")
dbWriteTable(con, "mytable", mydata.table)

dbDisconnect(con)
```

## Extract Data from SQLite in R

```R
install.packages("RSQLite")
library(RSQLite)

con <- dbConnect(RSQLite::SQLite(), "mydatabase.sqlite")
mydata <- dbGetQuery(con, "SELECT column1, column2 FROM mytable")

dbDisconnect(con)
```

## Extract Data from SQLite in Shell

The below code extracts data from SQLite in the shell command.

```shell
sqlite3 -csv path/to/your.sqlite "SELECT * FROM your_table_name;"
```