---
slug: '/notes/ChAMP-3.0:-champ.Overlap()'
date: '2022-04-12'
title: 'ChAMP 3.0: champ.Overlap()'
tags: ['ChAMP', 'annotation']
abstract: 'A new function added to ChAMP for general mapping between two segments on genome. Like mapping CpGs, Peaks .etc to Genes, CpGIslands .etc'
---

For a long time I need to do write custome code for mappping between CpGs and Transcripts, Peaks and Transcript Factor Binding Sites .etc. It's time to write a universal solution for this. The newly added `champ.Overlap()` function perform this task well. This function requires two genome coordinates based data.frame as input, then collapse the records in second data.frame into the first data.frame. The cool thing for this function is that it can: 
1. Allow custome function for attibutes **collapse**; For example `y` is genome annotation, the function can "concat" attibutes user like, for example calculate mean value for a numeric variable, or conact a character array into a long string as output. etc. This kind of action that "merge" multiple values in `y` to one sample record in `x` is defined as "collapse". And this kind of collapse function can be defined by user themselves.
2. It can be done reversely, like `x -> y` and `y -> x` both work. Assuming `peaks` is a data.frame of peaks on genome, `promoters` is a data.frame of transcript promoters. You can run `champ.Overlap(peaks, promoter)` to map find all promoters that each peak related. Or you can run `champ.Overlap(promoter, peaks)` to find peaks that one promoter covered.

The code is [here](https://github.com/YuanTian1991/ChAMP-Script/blob/master/champ.overlap.R). To use it, simply source the script like:

```R
source("https://raw.githubusercontent.com/YuanTian1991/ChAMP-Script/master/champ.Overlap.R")
```

Note that two packages are required: `GenomicRanges` and `data.table`.

---

## Function Usage

```R
peakAnno <- champ.Overlap(x=peaks, y=promoterAnno, 
                          yAttributes=c("feature", "transcriptClass", "geneSymbol"), 
                          collapseFunctions=list(ConcatCharacterArray, ConcatCharacterArray, ConcatCharacterArray))

geneMapping <- champ.Overlap(x=promoterAnno, y=peaks, 
                             yAttributes=c("cnt", "fraction"), 
                             collapseFunctions=c(mean, mean))
```

*Parameters:*
* **x**: A data frame contains at least chromosome, start, end; And some additional attributes.
* **y**: A data frame contains at least chromosome, start, end; And some additional attributes.
* **yAttributes**: colnames to be collapsed, they MUST be existing in y data.frame above.
* **collapseFunctions**: functions to be used to collpase each yAttributes above. Note that it MUST match above yAttibutes, and it directly take a array (or single value) as input, no extra parameter can be set inside.

*Outputs:*
* A data.frame with overlapped records in x data.frame, with collapsed y attributes on eachj column.

*Other:*
When you source the file, one function `ConcatCharacterArray` will be created, it's a simple function as below:

```R
ConcatCharacterArray <- function(x) {
    paste(x, collapse=";")
}
```
The purpose of this function is to avoid input of collapse parameter in paste function, so that `ConcatCharacterArray(c("A", "B", "C"))` can directly return `"A;B;C"`. 

That's the requirement of `collapseFunction` parameter in `champ.overlap()` function. It allow user to pass into as function, but not any other parameters, like `mean`, `sum`. If user really need some parameter, like `collapse=';'` in paste function, they can create a simple function wrap the function and parameter defined.

## Example

Below is an example to show the functionality.

### Two Genome Segements data frames

Below is a list of 5hmC peaks data I have. The `cnt`, `ocp`, `fraction` are values each peak holds.

```R
> head(peaks)
    seqnames  start    end      cnt ocp  fraction
6       chr1  20598  22060 5.921950   8 0.8888889
11      chr1  29706  30271 4.712342   9 1.0000000
37      chr1 191411 192483 5.935521   7 0.7777778
42      chr1 200117 200768 4.969351   7 0.7777778
102     chr1 812669 813322 4.704344   7 0.7777778
121     chr1 888214 888815 5.876435   7 0.7777778
>
```

Below is a list of transcript promoter I have. It contains coordinates of each transcript, and related geneSymbol, transcriptClass, feature .etc

```R
> head(promoterAnno)
         seqnames start   end  feature  geneSymbol transcriptClass
70287.1      chr1  9868 12367 Promoter     DDX11L1          pseudo
66063.1      chr1 10009 12508 Promoter     DDX11L1          pseudo
97153.25     chr1 29071 31570 Promoter      WASH7P          pseudo
195386.5     chr1 16937 19436 Promoter   MIR6859-1       nonCoding
84233.1      chr1 27553 30052 Promoter MIR1302-2HG       nonCoding
80682.1      chr1 28266 30765 Promoter MIR1302-2HG       nonCoding
```

### Annotate peaks with Transcript Promoter

First task is annotate peaks with transcript promoter. This is a common task in Bioinformatics, we found a list of DMR/DMP/Peaks, and we want to know if these target-of-interested are located in specific genome regions like CpG Islands, Promoters .etc

```R
peakAnno <- champ.Overlap(x=peaks, y=promoterAnno, 
                          yAttributes=c("feature", "transcriptClass", "geneSymbol"), 
                          collapseFunctions=list(ConcatCharacterArray, ConcatCharacterArray, ConcatCharacterArray))
```
The result looks like below:

```R
> knitr::kable(head(peakAnno,10))

|     |seqnames |   start|     end|      cnt| ocp|  fraction| xIndex| yOvNumber|yIndexList                      |feature                                                                 |transcriptClass                                                    |geneSymbol                                                       |
|:----|:--------|-------:|-------:|--------:|---:|---------:|------:|---------:|:-------------------------------|:-----------------------------------------------------------------------|:------------------------------------------------------------------|:----------------------------------------------------------------|
|11   |chr1     |   29706|   30271| 4.712342|   9| 1.0000000|      2|         4|3;5;6;7                         |Promoter;Promoter;Promoter;Promoter                                     |pseudo;nonCoding;nonCoding;nonCoding                               |WASH7P;MIR1302-2HG;MIR1302-2HG;MIR1302-2                         |
|262  |chr1     | 1232588| 1234675| 6.301465|   7| 0.7777778|      7|         6|306;307;308;309;313;314         |Promoter;Promoter;Promoter;Promoter;Promoter;Promoter                   |coding;coding;coding;coding;nonCoding;coding                       |SDF4;SDF4;SDF4;SDF4;SDF4;B3GALT6                                 |
|309  |chr1     | 1316821| 1318275| 5.682353|   7| 0.7777778|      8|         8|370;378;379;393;395;397;398;408 |Promoter;Promoter;Promoter;Promoter;Promoter;Promoter;Promoter;Promoter |problem;nonCoding;problem;coding;problem;problem;problem;nonCoding |INTS11;INTS11;INTS11;INTS11;INTS11;INTS11;INTS11;ENSG00000240731 |
|399  |chr1     | 1540876| 1542847| 6.430392|   7| 0.7777778|      9|         3|533;534;535                     |Promoter;Promoter;Promoter                                              |coding;coding;coding                                               |TMEM240;TMEM240;TMEM240                                          |
|416  |chr1     | 1570375| 1572375| 6.333858|   9| 1.0000000|     12|         1|540                             |Promoter                                                                |nonCoding                                                          |ENSG00000215014                                                  |
|532  |chr1     | 1818847| 1820437| 5.931760|   7| 0.7777778|     19|         1|659                             |Promoter                                                                |problem                                                            |GNB1                                                             |
|537  |chr1     | 1827081| 1830492| 6.625202|   7| 0.7777778|     20|         1|663                             |Promoter                                                                |problem                                                            |GNB1                                                             |
|672  |chr1     | 2133753| 2135669| 6.581739|   7| 0.7777778|     29|         4|729;730;731;732                 |Promoter;Promoter;Promoter;Promoter                                     |coding;coding;coding;nonCoding                                     |PRKCZ;PRKCZ;PRKCZ;PRKCZ                                          |
|726  |chr1     | 2244867| 2247532| 6.418189|   7| 0.7777778|     31|         1|759                             |Promoter                                                                |nonCoding                                                          |SKI                                                              |
|1457 |chr1     | 6236299| 6237233| 4.969481|   7| 0.7777778|     45|         5|1193;1195;1196;1198;1199        |Promoter;Promoter;Promoter;Promoter;Promoter                            |coding;coding;coding;nonCoding;nonCoding                           |ICMT;ICMT;ICMT;LINC00337;LINC00337                               |
```

The `xIndex` is the row number of this record in origin x data.frame. The `yOvNumber` is number of records in y mapped on corresponding x record. The `yIndexList` is index list of mapped y record. The following columns are features assigned in `yAttributes`, they are collapsed based on function in `collapseFunctions`. In above example, the function it used is `ConcatCharacterArray`, which will concat character arraies.

### Use self-defined Collapse Function

We can define our function as well, like:

```R
ConcatUnique <- function(x) {
    paste(unique(x), collapse=";")
}

peakUniqueFeature <- champ.Overlap(x=peaks, y=promoterAnno, 
                          yAttributes=c("feature", "transcriptClass"), 
                          collapseFunctions=list(ConcatUnique, ConcatUnique))
```

The result looks like:

```R
> knitr::kable(head(peakUniqueFeature,10))

|     |seqnames |   start|     end|      cnt| ocp|  fraction| xIndex| yOvNumber|yIndexList                      |feature  |transcriptClass          |
|:----|:--------|-------:|-------:|--------:|---:|---------:|------:|---------:|:-------------------------------|:--------|:------------------------|
|11   |chr1     |   29706|   30271| 4.712342|   9| 1.0000000|      2|         4|3;5;6;7                         |Promoter |pseudo;nonCoding         |
|262  |chr1     | 1232588| 1234675| 6.301465|   7| 0.7777778|      7|         6|306;307;308;309;313;314         |Promoter |coding;nonCoding         |
|309  |chr1     | 1316821| 1318275| 5.682353|   7| 0.7777778|      8|         8|370;378;379;393;395;397;398;408 |Promoter |problem;nonCoding;coding |
|399  |chr1     | 1540876| 1542847| 6.430392|   7| 0.7777778|      9|         3|533;534;535                     |Promoter |coding                   |
|416  |chr1     | 1570375| 1572375| 6.333858|   9| 1.0000000|     12|         1|540                             |Promoter |nonCoding                |
|532  |chr1     | 1818847| 1820437| 5.931760|   7| 0.7777778|     19|         1|659                             |Promoter |problem                  |
|537  |chr1     | 1827081| 1830492| 6.625202|   7| 0.7777778|     20|         1|663                             |Promoter |problem                  |
|672  |chr1     | 2133753| 2135669| 6.581739|   7| 0.7777778|     29|         4|729;730;731;732                 |Promoter |coding;nonCoding         |
|726  |chr1     | 2244867| 2247532| 6.418189|   7| 0.7777778|     31|         1|759                             |Promoter |nonCoding                |
|1457 |chr1     | 6236299| 6237233| 4.969481|   7| 0.7777778|     45|         5|1193;1195;1196;1198;1199        |Promoter |coding;nonCoding         |
```

Note that in above example, after collaping, the value in feature/transcriptClass does NOT match y IndexList anymore, and they don't match each other either. Thus use should be careful about the "collapseFunctions".

### Annotate Transcript Factors with Peaks

This is also a popular task in Bioinformatics, when we get a list of Differential Methylated Signals, we want to know what genes are overlapped by these DMPs, and how many DMPs are located in each gene promoter.

```R
geneMapping <- champ.Overlap(x=promoterAnno, y=peaks, 
                             yAttributes=c("cnt", "fraction"), 
                             collapseFunctions=c(mean, mean))
```

```R
> knitr::kable(head(geneMapping,10))

|          |seqnames |   start|     end|feature  |geneSymbol  |transcriptClass | xIndex| yOvNumber|yIndexList |      cnt|  fraction|
|:---------|:--------|-------:|-------:|:--------|:-----------|:---------------|------:|---------:|:----------|--------:|---------:|
|97153.25  |chr1     |   29071|   31570|Promoter |WASH7P      |pseudo          |      3|         1|2          | 4.712342| 1.0000000|
|84233.1   |chr1     |   27553|   30052|Promoter |MIR1302-2HG |nonCoding       |      5|         1|2          | 4.712342| 1.0000000|
|80682.1   |chr1     |   28266|   30765|Promoter |MIR1302-2HG |nonCoding       |      6|         1|2          | 4.712342| 1.0000000|
|186707.1  |chr1     |   28365|   30864|Promoter |MIR1302-2   |nonCoding       |      7|         1|2          | 4.712342| 1.0000000|
|233417.17 |chr1     | 1231568| 1234067|Promoter |SDF4        |coding          |    306|         1|7          | 6.301465| 0.7777778|
|17356.17  |chr1     | 1231502| 1234001|Promoter |SDF4        |coding          |    307|         1|7          | 6.301465| 0.7777778|
|3866.17   |chr1     | 1231532| 1234031|Promoter |SDF4        |coding          |    308|         1|7          | 6.301465| 0.7777778|
|77565.17  |chr1     | 1231532| 1234031|Promoter |SDF4        |coding          |    309|         1|7          | 6.301465| 0.7777778|
|72549.9   |chr1     | 1231469| 1233968|Promoter |SDF4        |nonCoding       |    313|         1|7          | 6.301465| 0.7777778|
|26428.1   |chr1     | 1230236| 1232735|Promoter |B3GALT6     |coding          |    314|         1|7          | 6.301465| 0.7777778|
```

That's it, an genome overlap function works for both ways. And can costumly collapse features.