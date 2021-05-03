---
slug: '/notes/Approches-to-quickly-get-gene-or-promoter-coordinates'
date: '2021-05-03'
title: 'Approches to quickly get gene or promoter coordinates'
tags: ['R', 'Annotation']
abstract: 'It is such a common requirement in Bioinformatic that we need to get gene coordinates, or promoter region location across whole genome. Here I want to record ways to do it.'
---

Here I want to record some ways to fetch gene coordinates, annotated promoters' coordinates for Bioinformatic analysis.

## 1. ChIPpeakAnno with GenomicRanges

I found this package when I was working on ChIP-seq data. It works well to extract gene coordinates across whole genome. After loading `ChIPpeakAnno` and `TxDb.Hsapiens.UCSC.hg38.knownGene` packages, all gene's location could be fetched. Note you may want to use org.Hs.eg.db to re-name these genes after mapping.

After fetching the gene coordinates, GenomicRanges package's nice function promoters could be used to calcualte promoter coordinates. Note that 1) There are possibily more than one promoters function in your R session (like defined by other packages), be careful that you need to use the GenomicRanges one. 2) The default promoter is defined as upstream 2000 to downsteam 200 around TSS, you can adjust the parameter.


```R
library(TxDb.Hsapiens.UCSC.hg38.knownGene)
library(ChIPpeakAnno)

annoData <- toGRanges(TxDb.Hsapiens.UCSC.hg38.knownGene, feature="gene") # KEY CODE for gene coordicate extraction.
annoPromoter <- GenomicRanges::promoters(annoData)                       # Using promoters() function to get promoter regions based on last code.

# Below is an easy way to annotate your peaks (regions) with your prepared annoData or annoPromoter.
# I used peaks returned from DiffBind, but I though any GRange format data should work.
myPeaks <- annotatePeakInBatch(myPeaks, AnnotationData=annoPromoter)

# Below code could help to add other gene names. For example in below example, I added entrez_id and symbol.
library(org.Hs.eg.db)
myPeaks <- addGeneIDs(myPeaks, "org.Hs.eg.db", IDs2Add = c("entrez_id", 'symbol'))
```

Below is the annotated results, it looks good. Note that the **insideFeature** will indicates the relationship between these peaks with related gene promoter location, which means maybe the peaks is NOT actually overlapped with promoters. It includes mapping results like "upstream", "downsteam", indicates this peak is located at the upstream or downsteam of promoter. You can filtering this column to get "overlapped peaks in promoters."

```R
> head(df[,c(1:5, 24:33)])
                           seqnames     start       end width strand
X132751.27242.27242            chr6  47362760  47363260   501      *
X96556.100500813.100500813    chr20  44410059  44410559   501      *
X159552.8328.8328              chr9 132937303 132937803   501      *
X6292.1718.1718                chr1  54856281  54856781   501      *
X99797.2114.2114              chr21  38824108  38824608   501      *
X155442.10507.10507            chr9  89525654  89526154   501      *
                                       peak   feature start_position
X132751.27242.27242           X132751.27242     27242       47309706
X96556.100500813.100500813 X96556.100500813 100500813       44406120
X159552.8328.8328              X159552.8328      8328      132943551
X6292.1718.1718                  X6292.1718      1718       54886996
X99797.2114.2114                X99797.2114      2114       38803183
X155442.10507.10507           X155442.10507     10507       89497931
                           end_position feature_strand insideFeature
X132751.27242.27242            47311905              -      upstream
X96556.100500813.100500813     44408319              +    downstream
X159552.8328.8328             132945750              +      upstream
X6292.1718.1718                54889195              -    downstream
X99797.2114.2114               38805382              +    downstream
X155442.10507.10507            89500130              -      upstream
                           distancetoFeature shortestDistance
X132751.27242.27242                   -50855            50855
X96556.100500813.100500813              3939             1740
X159552.8328.8328                      -6248             5748
X6292.1718.1718                        32914            30215
X99797.2114.2114                       20925            18726
X155442.10507.10507                   -25524            25524
                           fromOverlappingOrNearest   symbol
X132751.27242.27242                 NearestLocation TNFRSF21
X96556.100500813.100500813          NearestLocation  MIR3646
X159552.8328.8328                   NearestLocation    GFI1B
X6292.1718.1718                     NearestLocation   DHCR24
X99797.2114.2114                    NearestLocation     ETS2
X155442.10507.10507                 NearestLocation   SEMA4D
>
```

## 2. ChIPpeakAnno provided TSS Annotation

I found that ChIPpeakAnno provided a set of [TSS annotation](https://www.rdocumentation.org/packages/ChIPpeakAnno/versions/3.6.5/topics/TSS.human.GRCh38). I checked that these TSS.xxx actually means the whole gene ranges, so it can be seen as whole gene coordinates.

```R
library(org.Hs.eg.db)
library(ChIPpeakAnno)

data(TSS.human.GRCh38)

annoPromoter <- GenomicRanges::promoters(TSS.human.GRCh38)

myPeaks <- annotatePeakInBatch(myPeaks, AnnotationData=annoPromoter)
myPeaks <- addGeneIDs(myPeaks, "org.Hs.eg.db", IDs2Add = c("entrez_id", 'symbol'))
```

**However, after above code annotation, I found a lot of difference between TSS annotate and the first annotation way.** I chekced the matching, the ensembl_gene_id are similar between two annotation, but after addGeneIDs, the gene symbol varis a lot...