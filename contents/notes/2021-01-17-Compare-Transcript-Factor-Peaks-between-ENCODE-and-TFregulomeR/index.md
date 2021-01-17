---
slug: '/notes/Compare-Transcript-Factor-Peaks-between-ENCODE-and-TFregulomeR'
date: '2021-01-17'
title: 'Compare Transcript Factor Peaks between ENCODE and TFregulomeR'
tags: ["TFBS", "TFEA"]
abstract: 'Previously I found a very good database TFregulomeR. However, before I move one, I want check the quality of TFregulomeR by comparing the peaks to ENCODE.'
---

TFregulomeR is a new R package to provide quick TF peak and motif browser. It generated it's data from GTRD and MethMotif. Compared with troditional ENCODE project, this package has a larger database. But like GTRD, I think it contains many public data's ChIP-seq result, so I don't know how well it match ENCODE. Also, since ENCODE is constructed based on hg19/mm10, but TFregulomeR is based on hg38/mm10. It's worth to check if they match each other.

## 1. Compare TAF1 Peaks between ENCODE and TFregulomeR

So I randomly select a TF TAF1 on H1-ESC, which exist in both ENCODE and TFregulomeR. First I get TAF1's peak from TFregulomeR. **Note that all TFregulomeR's peak are just one summit coordinates, which mean it is just one position. However ENCODE TFBS is a peak range, with mean value as 422.25. So I expended the TFregulomeR's peak from both sides of the summit to 250 bp.**

```r
library(TFregulomeR)
library(GenomicRanges)

all_record <- dataBrowser()

TAF1.index <- which(all_record$species == "human" &
                    all_record$"cell_tissue_name" == "H1-hESC" &
                    all_record$"TF" == "TAF1")

Regulome <- loadPeaks(id = all_record[TAF1.index, "ID"], includeMotifOnly = FALSE)
Regulome.gr <- makeGRangesFromDataFrame(Regulome)
Regulome.gr <- GenomicRanges::promoters(Regulome.gr, 250, 250) # Expend TFBS from the summit to upstream and downstream.
```

Then, I tried to get TAF1's ENCODE peaks. I downloaded it from [this link](http://hgdownload.cse.ucsc.edu/goldenPath/hg19/encodeDCC/wgEncodeAwgTfbsUniform/). The file I downloaded is "wgEncodeAwgTfbsHaibH1hescTaf1V0416102UniPk.narrowPeak". Then load it into R.

```r
ENCODE <- read.csv("wgEncodeAwgTfbsHaibH1hescTaf1V0416102UniPk.narrowPeak", header=F, sep="\t")
colnames(ENCODE)[1:3] <- c("seqnames", "start", "end")
ENCODE.gr <- makeGRangesFromDataFrame(ENCODE[,1:3])
```

There are 16855 peaks in Regulome. 20547 peaks in ENCODE, there are about 400 peaks in number difference. By checking each chromosome's result, the number is similar.

```r
> table(Regulome[,1])

 chr1 chr10 chr11 chr12 chr13 chr14 chr15 chr16 chr17 chr18 chr19  chr2 chr20
 1732   671   909   907   336   558   547   672   947   261  1242  1104   442
chr21 chr22  chr3  chr4  chr5  chr6  chr7  chr8  chr9  chrX  chrY
  141   378   942   657   791   986   818   606   682   505    21
> table(ENCODE[,1])

 chr1 chr10 chr11 chr12 chr13 chr14 chr15 chr16 chr17 chr18 chr19  chr2 chr20
 2146   799  1109  1108   414   705   656   806  1119   339  1497  1372   557
chr21 chr22  chr3  chr4  chr5  chr6  chr7  chr8  chr9  chrX  chrY
  176   461  1187   782  1014  1258   993   698   792   538    21
>
```

## 2. Mapping for hg38 and hg19

Top check the mapping difference between hg38 and hg19, I used latest release [Ilumina Human Methylation EPIC array's annotation](https://emea.support.illumina.com/array/array_kits/infinium-methylationepic-beadchip-kit/downloads.html). **This Annotation provided both hg19 and hg38 annotation for each CpG sites.** So the solution is, use the hg19 version EPIC annotation to map the ENCODE version TFBS, and use hg38 version EPIC annotation to map the TFregulomeR version TFBS.

Below is the code.

```r

## Read EPIC B5 manifest.
B5_Annotation <- "../../../../ChAMP_3.0/Manifests/infinium-methylationepic-v-1-0-b5-manifest-file.csv"
skipline <- which(substr(readLines(B5_Annotation),1,7) == "[Assay]")
Manifest <- read.csv(B5_Annotation, head=T, sep=",", skip=skipline, as.is=T)

## Prepare hg19 CpG annotation.
hg19EPIC <- Manifest[, c("CHR", "MAPINFO", "MAPINFO")]
colnames(hg19EPIC) <-  c("seqnames", "start", "end")
hg19EPIC <- hg19EPIC[-unique(which(is.na(hg19EPIC), arr.ind=T)[,1]),]
hg19EPIC$seqnames <- paste0("chr", hg19EPIC$seqnames)

## Prepare hg38 CpG annotation.
hg38EPIC <- Manifest[, c("CHR_hg38", "Start_hg38", "End_hg38")]
colnames(hg38EPIC) <-  c("seqnames", "start", "end")
hg38EPIC[, "end"] <- hg38EPIC[,"start"] <- hg38EPIC$start + 1
hg38EPIC <- hg38EPIC[-unique(which(is.na(hg38EPIC), arr.ind=T)[,1]),]

# Find overlap between hg19 with ENCODE
ovhg19 <- data.frame(findOverlaps(ENCODE.gr, makeGRangesFromDataFrame(hg19EPIC)))

# Find overlap between hg38 with TFregulome
ovhg38 <- data.frame(findOverlaps(Regulome.gr, makeGRangesFromDataFrame(hg38EPIC)))
```

Finally I checked the mapping status, the total number is similar. In short, by mapping ENCODE's hg19 version TAF1 Peaks with hg19 version EPIC annotation, there are 0.08005176 CpGs are located in TAF1 Peaks range. By mapping TFregulomeR's hg38 version TAF1 Peaks with hg38 version EPIC annotation, there are 0.08544353 CpGs are located in TAF1 peaks.

```r
> dim(ovhg19)
[1] 77044     2
> dim(ovhg38)
[1] 73370     2
>
```

What if we mismatched genome version? **So, don't mismatch genome version.**

```r
> ovMisMatch <- data.frame(findOverlaps(ENCODE.gr, makeGRangesFromDataFrame(hg38EPIC)))
> dim(ovMisMatch)
[1] 7252    2
> ovMisMatch <- data.frame(findOverlaps(Regulome.gr, makeGRangesFromDataFrame(hg19EPIC)))
> dim(ovMisMatch)
[1] 6968    2
>
```
