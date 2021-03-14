---
slug: '/notes/Read-count-and-initial-quality-check-plots-on-BAM-files'
date: '2021-03-14'
title: 'Read count and initial quality check plots on BAM files'
tags: ['R', 'MeDIP-seq', 'bam', 'PCA']
abstract: 'I want to quickly check the quality of a set of BAM files, generated from bowtie2. However, I did not see many tools for it, eventually I found multiBamSummary is one solution out. Here I record a bit how I get read count matrix from a set of BAM files, then plot a quick plotly plot for visualisation.'
---

The thing starts as I have a set of BAM files, some of them are low quality samples. So I want to have a quick quality check on them. Apart from troditional `fastQC` or `fastp` way, plots like `MDS`, `PCA`, `tSNE`, `Heatmap`, `Dendrogram` are quite useful for quality check. **However, one vital problem is, normally we need a matrix data to plot above plots, so eventually I get this question: How to get a "value" matrix from a set of BAM files?**

After searching online, I think one answer close to my requirement is [multiBamSummary](https://deeptools.readthedocs.io/en/develop/content/tools/multiBamSummary.html#:~:text=multiBamSummary%20computes%20the%20read%20coverages,the%20BED%2Dfile%20mode%20instead.) from deepTool. It computes the read coverages for genomic regions for typically two or more BAM files. In other words, it will count reads for all bam files into small region bins, and return a matrix-similar result, with rows as bins and columns as each sample (bam file). Note that deepTool actually provided another function [plotPCA](https://deeptools.readthedocs.io/en/develop/content/tools/plotPCA.html) as downstream function of `multiBamSummary`, it could generate a PCA plot based on the result fo multiBamSummary. However, I perfer to create wheel myself, as a matrix would alow me to do more things, but a PCA PNG plot can't help me much. 

So the solution is firstly get readCount matrix from multiBamSummary, then try plot some quality check plot based on the result.

## Get Read Count matrix from multiBamSummary

The code is below works nicely, **remember that BAM files MUST be indexed**. My [this post](https://yuantian1991.github.io/notes/My-Samtools-Command) suggested a quick way to do sorting and indexing parallelly.

```bash
multiBamSummary bins --bamfiles ./myBam/* -o results.npz -bl ./myMergedGreyList.bed -p 30 --outRawCounts readCounts.tab
```
There are many parameters for multiBamSummary, above are some key I will use:

* **--bamfiles**: indicates location of bam files. For example in above code, I directly specified all bam files in one folder
* **-o**: output of default result results.npz, which is a compressed numpy array (.npz), I guess it's useful for python numpy users.
* **-bl**: a blacklist bed file for removing. If you have you can specify it. But actually think normally black list only count for a very small fraction across genome. It should not make much differece for PCA/Heatmap .etc. Normally I think I don't need this parameter, because I normally do GreyList filtering myself with `GreyListChIP` and `bedtools intersect`.
* **-p**: parallel thread, luckily I have a good computational server...
* **--outRawCounts**: This is returned readCounts in txt format, convinient for people like me who don't use python.

---

To be continued...