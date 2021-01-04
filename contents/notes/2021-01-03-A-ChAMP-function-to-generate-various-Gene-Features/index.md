---
slug: '/notes/A-ChAMP-function-to-generate-various-Gene-Features'
date: '2021-01-03'
title: 'A ChAMP function to generate various Gene Features'
tags: ["ChAMP", "GeneFeature", "Annotation"]
abstract: 'Recently, when I am working on the latest Mouse Methylation Array, I found that the Manifest does not have gene annotation, like promoter, TSS200, Exon .etc, so here I wrote a function to generate all these gene features from UCSC refgene.'
---

illumina recently release [new Mouse Methylation Array](https://emea.support.illumina.com/downloads/infinium-mouse-methylation-manifest-file-csv.html), which is cool. However, after checking the manifest, I found this manifest did not included gene information, nor did TSS. So I have to match mm10 genome with CpG's position, to get their gene and TSS information. After looking around, I found there is no easy solution for gene feature coordinates generation. There seems to have some [R pacakge](https://bioconductor.org/packages/release/bioc/html/GenomicFeatures.html) could do it. However, gene annotation is a very arbitrary things, sometimes I want TSS200, TSS1500. Some other times I want Exon, First Exon. etc

The best example I find online is [this post](https://www.biostars.org/p/151628/). In which, ShiCheng Guo provided [his generated hg19 gene feature file](https://github.com/Shicheng-Guo/AnnotationDatabase/blob/master/hg19/refGeneExtent.hg19.bed.gz). The format looks perfect. Since I merely use R, and I hope I can in the future randomly generate gene features for various of species. So I wrote a [ChAMP function script](https://github.com/YuanTian1991/ChAMP-Script/blob/master/champ.GeneFeatures.R) for that.

After running, the result looks like below format:

```r
> geneFeature[50:90, ]
   seqnames start   end width strand        id    symbol  feature
50     chr1 17368 17436    68      - NR_106918 MIR6859-1     UTR3
51     chr1 17368 17436    68      - NR_106918 MIR6859-1   Exon_1
52     chr1 17436 17436     0      - NR_106918 MIR6859-1     UTR5
53     chr1 17437 17636   200      - NR_106918 MIR6859-1   TSS200
54     chr1 17636 18936  1300      - NR_106918 MIR6859-1  TSS1500
55     chr1 15437 19436  4000      - NR_106918 MIR6859-1 Promoter
56     chr1 19437 21436  2000      - NR_106918 MIR6859-1 Enhancer
57     chr1 17368 17436    68      - NR_107062 MIR6859-2     UTR3 # 
58     chr1 17368 17436    68      - NR_107062 MIR6859-2   Exon_1 #
59     chr1 17436 17436     0      - NR_107062 MIR6859-2     UTR5 #
60     chr1 17437 17636   200      - NR_107062 MIR6859-2   TSS200 # - strand gene example
61     chr1 17636 18936  1300      - NR_107062 MIR6859-2  TSS1500 #
62     chr1 15437 19436  4000      - NR_107062 MIR6859-2 Promoter #
63     chr1 19437 21436  2000      - NR_107062 MIR6859-2 Enhancer #
64     chr1 17368 17436    68      - NR_107063 MIR6859-3     UTR3
65     chr1 17368 17436    68      - NR_107063 MIR6859-3   Exon_1
66     chr1 17436 17436     0      - NR_107063 MIR6859-3     UTR5
67     chr1 17437 17636   200      - NR_107063 MIR6859-3   TSS200
68     chr1 17636 18936  1300      - NR_107063 MIR6859-3  TSS1500
69     chr1 15437 19436  4000      - NR_107063 MIR6859-3 Promoter
70     chr1 19437 21436  2000      - NR_107063 MIR6859-3 Enhancer
71     chr1 17368 17436    68      - NR_128720 MIR6859-4     UTR3
72     chr1 17368 17436    68      - NR_128720 MIR6859-4   Exon_1
73     chr1 17436 17436     0      - NR_128720 MIR6859-4     UTR5
74     chr1 17437 17636   200      - NR_128720 MIR6859-4   TSS200
75     chr1 17636 18936  1300      - NR_128720 MIR6859-4  TSS1500
76     chr1 15437 19436  4000      - NR_128720 MIR6859-4 Promoter
77     chr1 19437 21436  2000      - NR_128720 MIR6859-4 Enhancer
78     chr1 26365 28364  2000      + NR_036051 MIR1302-2 Enhancer #
79     chr1 28365 32364  4000      + NR_036051 MIR1302-2 Promoter #
80     chr1 28865 30165  1300      + NR_036051 MIR1302-2  TSS1500 #
81     chr1 30165 30364   200      + NR_036051 MIR1302-2   TSS200 # + strand gene example
82     chr1 30365 30503   138      + NR_036051 MIR1302-2     UTR5 #
83     chr1 30365 30503   138      + NR_036051 MIR1302-2   Exon_1 #
84     chr1 30503 30503     0      + NR_036051 MIR1302-2     UTR3 #
85     chr1 26365 28364  2000      + NR_036266 MIR1302-9 Enhancer
86     chr1 28365 32364  4000      + NR_036266 MIR1302-9 Promoter
87     chr1 28865 30165  1300      + NR_036266 MIR1302-9  TSS1500
88     chr1 30165 30364   200      + NR_036266 MIR1302-9   TSS200
89     chr1 30365 30503   138      + NR_036266 MIR1302-9     UTR5
90     chr1 30365 30503   138      + NR_036266 MIR1302-9   Exon_1
>
```

In above output, we can see the genes on strand + will be labelled with rank: Enhancer, Promoter, TSS1500, TSS200, UTR5, Exons/Intronsm UTR3. But for genes on - strand, above order would be reversed.


## 1. champ.GeneFeature() function

This function would directly get `refgene` genome annotation from UCSC website, which contains coordinates of genes, cds, and each exons' start end sites. So all other gene features are going to be generated based on them. The detailed define could be seen in below part.

It's easy to use this function:
```r
source("https://raw.githubusercontent.com/YuanTian1991/ChAMP-Script/master/champ.GeneFeatures.R")

myHg19GeneFeature <- champ.GeneFeature("hg19")

myMm10GeneFeature <- champ.GeneFeature("mm10")
```

There are only 3 parameter in this function:
* `db`: indicates version and species of genome, like "hg19", "hg38", "mm10"...
* `promoterRange`=c(2000, 2000):  Indicates the range of promoter around TSS, the default is 2000 upstream and 2000 downstream of TSS. First value is upstream, and second value is downstream.
* `features`=c("enhancer","promoter", "TSS200_1500", "UTR5", "UTR3", "Exons", "Introns")): These are all gene features can be generated. If user assign something other than these ones, they will be ignored.

The promoterRange actually can be used by user to generate any length of upstream and downstream of TSS. So users would like to get other range of promoter could tune this parameter.

## 2. RefGene

This script use RMySQL to fetch refgene from UCSC website. The code is below, which contains informations like gene start (txStart), ends (txEnd), exons' information.

```r
> library(RMySQL)

> con_ucsc <- dbConnect(RMySQL::MySQL(), db = "hg19", user = "genome", host = "genome-mysql.soe.ucsc.edu")
> refGene <- suppressWarnings(dbGetQuery(con_ucsc, stringr::str_interp("SELECT * FROM refGene")))
> dbDisconnect(con_ucsc)

> head(refGene)
   bin      name chrom strand   txStart     txEnd  cdsStart    cdsEnd exonCount
1 2085 NR_046630  chr3      + 196666747 196669405 196669405 196669405         3
2 2051 NR_046598  chr3      + 192232810 192234362 192234362 192234362         2
3 1312 NR_046514 chr13      +  95364969  95368199  95368199  95368199         2
4  585 NR_106918  chr1      -     17368     17436     17436     17436         1
5  585 NR_107062  chr1      -     17368     17436     17436     17436         1
6  585 NR_107063  chr1      -     17368     17436     17436     17436         1
                      exonStarts                       exonEnds score     name2
1 196666747,196667841,196669263, 196666995,196668013,196669405,     0 NCBP2-AS1
2           192232810,192234269,           192233297,192234362,     0 FGF12-AS2
3             95364969,95365891,             95365647,95368199,     0 SOX21-AS1
4                         17368,                         17436,     0 MIR6859-1
5                         17368,                         17436,     0 MIR6859-2
6                         17368,                         17436,     0 MIR6859-3
  cdsStartStat cdsEndStat exonFrames
1          unk        unk  -1,-1,-1,
2          unk        unk     -1,-1,
3          unk        unk     -1,-1,
4          unk        unk        -1,
5          unk        unk        -1,
6          unk        unk        -1,
>
```


## 3. Define of Gene Features

This is a tough questions, how to define the "most proper" range of promoter? TSS upstream 1500? or 2000? Here I just last the define I am using, this setting would be use in ChAMP's Mouse Methylation Annotation.

According to above refGene's table:

* **Promoter**: Upstream 2000 and Downstream 2000 around TSS. Note that strand (+) (-) would be considered here, so txStart means TSS in `+` strand, while txEnd means TSS in `-` strand.
* **Enhancer**: Upstream 2000 of Promoter, in other word, 4000 bp upstream of TSS, to 2000bp upstream.
* **TSS200**: Upstream 200 of TSS.
* **TSS1500**: Upstream 1500 to Upstream 200 of TSS. So, the length is 1300.
* **UTR5**: txStart to cdsStart for + strand genes. cdsEnd to exEnds for - strand genes.
* **UTR3**: cdsEnd to txEnd for + strand genes. txStart to cdsStart for - strand genes.
* **Exons**: each exonStarts to each exonEnds. Note that for - strand, exon labels would be reverse labelled, so exons with smaller number on coordinates would be labelled larger.
* **Introns**: each exonEnds to next exonStarts. Note that if there is a gap between cdsStart and first exonStart, there is a Intron here. So does gap between last exonEnds and cdsEnd.