---
slug: "/notes/My-Samtools-Command"
date: "2020-07-08"
title: "My Samtools Command"
tags: ['samtools']
abstract: "This is a note for my regular-used Samtools command."
---

This is a simple note to record my Samtools commands.

### Sort Bam file

By using parallel, the command is below.

```bash
parallel --plus 'samtools sort {...}.bam -o {...}.sorted.bam' ::: *.bam
```

---

### Index sorted Bam file

```bash
parallel --plus 'samtools index {...}.sorted.bam {...}.sorted.bam.bai' ::: *.bam
```

---

### Merge bam files into one bam

This situation happens when you have multiple bam file, all for same phenotype, you want to increase their depth by merging them togather.

**Note that these bam file should be sorted and indexed.**

```bash
samtools merge ./MergedBam/LT-bnd.bam ./SortedBam/SUL_LT49_bnd_chr.sorted.bam ./SortedBam/SUL_LT51_bnd_chr.sorted.bam ./SortedBam/SUL_LT52_bnd_chr.sorted.bam ./SortedBam/SUL_LT53_bnd_chr.sorted.bam ./SortedBam/SUL_LT55_bnd_chr.sorted.bam
```