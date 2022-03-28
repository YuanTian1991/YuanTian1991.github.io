---
slug: '/notes/Access-to-hg38-knownGene-Genome-Annotation'
date: '2022-03-28'
title: 'Access to hg38 knownGene Genome Annotation'
tags: ['annotation']
abstract: 'In my past post, I compared 5 different version of genome annotation, and seems knownGene is the best to use. It contains most transcripts, and update gradually with GENCODE. Here I record a bit how to fetch, organise, use knownGene.'
---

In my last post, I compared ncbiRefSeq, refGene, wgEncodeXXXXV39 and knownGene. Based on my test, knownGene is actually a pretty good "general usage" annotation and decide to it as my main (hopefully only) genome annotation across all my work. Here I record a bit how to get this knownGene (and it's attributes). Mererly I found two ways, one is through UCSC mySQL browser, and the other is R package `TxDb.Hsapiens.UCSC.hg38.knownGene`.

> knownGene for hg19 is generated from NCBI RefSeq, but knwonGene for hg38 is generated from GENCODE. So even the gene ID are not the same...

## UCSC MySQL Approach

This my favorite access, the code is simple. I use R access below, but actually any language would work. The table on UCSC mySQL is `knownGene`, **which is actually not match [the schema](https://genome.ucsc.edu/cgi-bin/hgTables?hgta_doSchemaDb=hg38&hgta_doSchemaTable=knownGene) though**...

```R
library(RMySQL)
library(GenomicRanges)
library(stringr)

con_ucsc <- dbConnect(RMySQL::MySQL(), db = "hg38", user = "genome", host = "genome-mysql.soe.ucsc.edu")
genomeAnnotation <- suppressWarnings(dbGetQuery(con_ucsc, stringr::str_interp("SELECT * FROM knownGene")))
dbDisconnect(con_ucsc)
```

The returned tabls is a data.frame. It contains key informations like chrom, TSS, TTS, cds range, exon locations .etc It's good enought for me to calculate ranges like first exon, 5-TUR .etc

```R
> knitr::kable(head(genomeAnnotation))

|name              |chrom |strand | txStart| txEnd| cdsStart| cdsEnd| exonCount|exonStarts         |exonEnds           |proteinID |alignID    |
|:-----------------|:-----|:------|-------:|-----:|--------:|------:|---------:|:------------------|:------------------|:---------|:----------|
|ENST00000619216.1 |chr1  |-      |   17368| 17436|    17368|  17368|         1|17368,             |17436,             |          |uc031tla.1 |
|ENST00000473358.1 |chr1  |+      |   29553| 31097|    29553|  29553|         3|29553,30563,30975, |30039,30667,31097, |          |uc057aty.1 |
|ENST00000469289.1 |chr1  |+      |   30266| 31109|    30266|  30266|         2|30266,30975,       |30667,31109,       |          |uc057atz.1 |
|ENST00000607096.1 |chr1  |+      |   30365| 30503|    30365|  30365|         1|30365,             |30503,             |          |uc031tlb.1 |
|ENST00000417324.1 |chr1  |-      |   34553| 36081|    34553|  34553|         3|34553,35276,35720, |35174,35481,36081, |          |uc001aak.4 |
|ENST00000461467.1 |chr1  |-      |   35244| 36073|    35244|  35244|         2|35244,35720,       |35481,36073,       |          |uc057aua.1 |
>
```

However, I need some more additional information, like Gene Symbol, Transcript Types (coding gene, long-non-coding .etc). The `knownAttrs` and `kgXref` is a good option. We can get it as below:

```R
genomeAttrs <- suppressWarnings(dbGetQuery(con_ucsc, stringr::str_interp("SELECT * FROM knownAttrs")))
genomeXref <- suppressWarnings(dbGetQuery(con_ucsc, stringr::str_interp("SELECT * FROM kgXref")))
```

`knownAttrs` is useful here is because it provided geneID, geneType and havana status.
```R
> knitr::kable(head(genomeAttrs))

|kgID               |geneId             |geneStatus |geneType       |transcriptName |transcriptType |transcriptStatus |havanaGeneId         |ccdsId      |supportLevel |transcriptClass |
|:------------------|:------------------|:----------|:--------------|:--------------|:--------------|:----------------|:--------------------|:-----------|:------------|:---------------|
|ENST00000000233.10 |ENSG00000004059.11 |           |protein_coding |ARF5-201       |protein_coding |                 |OTTHUMG00000023246.7 |CCDS34745.1 |2            |coding          |
|ENST00000000412.8  |ENSG00000003056.8  |           |protein_coding |M6PR-201       |protein_coding |                 |OTTHUMG00000168276.4 |CCDS8598.1  |2            |coding          |
|ENST00000000442.11 |ENSG00000173153.17 |           |protein_coding |ESRRA-201      |protein_coding |                 |OTTHUMG00000150641.9 |CCDS41667.1 |2            |coding          |
|ENST00000001008.6  |ENSG00000004478.8  |           |protein_coding |FKBP4-201      |protein_coding |                 |OTTHUMG00000090429.4 |CCDS8512.1  |2            |coding          |
|ENST00000001146.7  |ENSG00000003137.9  |           |protein_coding |CYP26B1-201    |protein_coding |                 |OTTHUMG00000129756.5 |CCDS1919.1  |2            |coding          |
|ENST00000002125.9  |ENSG00000003509.16 |           |protein_coding |NDUFAF7-201    |protein_coding |                 |OTTHUMG00000128468.7 |CCDS1788.1  |2            |coding          |
>
```

`kgXref` is useful because it provided a mapping between Ensembl gene ID (kgID below), geneSymbol and NCBI RefSeq gene ID.

```R
> knitr::kable(head(genomeXref))

|kgID              |mRNA      |spID |spDisplayID |geneSymbol  |refseq    |protAcc   |description                                                                                                       |rfamAcc |tRnaName |
|:-----------------|:---------|:----|:-----------|:-----------|:---------|:---------|:-----------------------------------------------------------------------------------------------------------------|:-------|:--------|
|ENST00000619216.1 |NR_106918 |     |            |MIR6859-1   |NR_106918 |NR_106918 |Homo sapiens microRNA 6859-1 (MIR6859-1), microRNA. (from RefSeq NR_106918)                                       |        |         |
|ENST00000473358.1 |          |     |            |MIR1302-2HG |          |          |MIR1302-2 host gene (from HGNC MIR1302-2HG)                                                                       |        |         |
|ENST00000469289.1 |          |     |            |MIR1302-2HG |          |          |MIR1302-2 host gene (from HGNC MIR1302-2HG)                                                                       |        |         |
|ENST00000607096.1 |NR_036051 |     |            |MIR1302-2   |NR_036051 |NR_036051 |Homo sapiens microRNA 1302-2 (MIR1302-2), microRNA. (from RefSeq NR_036051)                                       |        |         |
|ENST00000417324.1 |NR_026818 |     |            |FAM138A     |NR_026818 |NR_026818 |Homo sapiens family with sequence similarity 138 member A (FAM138A), long non-coding RNA. (from RefSeq NR_026818) |        |         |
|ENST00000461467.1 |AY341950  |     |            |FAM138A     |          |          |family with sequence similarity 138 member A (from HGNC FAM138A)                                                  |        |         |
>
```

That's good enough, then I need to organise these 3 table togather with a R script, for long-term usage.

> Additionally, another very important table can be get from UCSC is `cpgIslandExt`, which listed all CpG Islands on genome. The schema is [here](https://genome.ucsc.edu/cgi-bin/hgTables?hgta_doSchemaDb=hg38&hgta_doSchemaTable=cpgIslandExt).


The pity thing here is, I always want to find a "universal" way to preprocess UCSC Table, like make it works across NCBI RefSeq, RefGene, GENCODE. etc, but sadly even from UCSC website, tables have different column, names .etc. Thus, my champ.GeneFeature() function looks can only deal with one of them carefully. So now I will upgrade champ.GeneFeature function as `knownGene`, `knownAttrs`, `kgXref`, and `cpgIslandExt`.


## TxDb.Hsapiens.UCSC.hg38.knownGene

TxDb R annotation pacakge is also built on knownGene table from UCSC. **However, I found that the last version was built last year, which means it's not very up-to-date,** but still it's a pretty good annotation package.

```R
library("GenomicFeatures")
library("TxDb.Hsapiens.UCSC.hg38.knownGene")

txdb <- TxDb.Hsapiens.UCSC.hg38.knownGene
knitr::kable(metadata(txdb))


|name                                     |value                                        |
|:----------------------------------------|:--------------------------------------------|
|Db type                                  |TxDb                                         |
|Supporting package                       |GenomicFeatures                              |
|Data source                              |UCSC                                         |
|Genome                                   |hg38                                         |
|Organism                                 |Homo sapiens                                 |
|Taxonomy ID                              |9606                                         |
|UCSC Table                               |knownGene                                    |
|UCSC Track                               |GENCODE V38                                  |
|Resource URL                             |http://genome.ucsc.edu/                      |
|Type of Gene ID                          |Entrez Gene ID                               |
|Full dataset                             |yes                                          |
|miRBase build ID                         |NA                                           |
|Nb of transcripts                        |258145                                       |
|Db created by                            |GenomicFeatures package from Bioconductor    |
|Creation time                            |2021-10-19 10:58:00 -0700 (Tue, 19 Oct 2021) |
|GenomicFeatures version at creation time |1.45.2                                       |
|RSQLite version at creation time         |2.2.8                                        |
|DBSCHEMAVERSION                          |1.2                                          |
>
```

Then below functions return transcrips from this annotation package:

```R
features <- transcriptsBy(txdb)
# The result is grouped by genes, in other word, it returned transcripts in each gene.
# BE CAREFUL, if unlist as below, gene informaiton is lost...
features <- unlist(features)
```

Here on important feature here is to get gene information (not transcript). To me, nowadays the words `gene` and `transcript` has been mix-used widely. Many times people say "genome annotaiton", actually they are doing "transcriptom annotation". TxDb provided a way to get gene information:

```R
genes <- genes(txdb)
```
It will only return genes (not transcripts), but I did not quite understand how he did that... And one thing I can't quite understand is there is only 217130 transcripts, and 29474 genes from above two functions. I suspect there is some filtering step in it... Another problem is inconsistency gene ID, with `transcriptsBy()` it use Ensembl (GENCODE) gene ID, but in `genes()` it use another gene ID...

Additionally, if I want to get intron/exon/cds, I can use below code:

```R
intronList <- intronsByTranscript(txdb)
exonList <- exonsBy(txdb)
cdsBy(txdb)
fiveUTRsByTranscript(txdb)
threeUTRsByTranscript(txdb)
```

> There is a function called `promoters()`, it's the same name as the function from "GenomicRanges", so I should be very careful when to use `promoters()` function.


## Summary

In short, I will in the future merely (hopefully only) use knownGene for all Bioinformatic work. By coding my own script from UCSC Table enabls me to:
1. Always get most updated knownGene table.
2. Easy to modify, no restrictions from sealed/wrapped packages.
3. Get transcript types, like protain-coding, pseudo .etc
4. Get matched gene Id from Ensembl to NCBI RefSeq to Gene Symbol.
5. I can write a general visualisation function based on my-created annotation format, for CpG/Peak visualisation.

The limitations are:
1. I need to code myself, and maintain the code if one day knownGene get updated.
2. The knownGene table may get updated, which will cause reproducible problem. In this case, actually wgEncodeXXXXV39 have some advantage.