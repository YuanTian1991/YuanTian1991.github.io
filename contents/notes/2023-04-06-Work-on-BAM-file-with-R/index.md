---
slug: '/notes/Work-on-BAM-file-with-R'
date: '2023-04-06'
title: 'Work on BAM file with R'
tags: ["R", "BAM"]
abstract: 'BAM is large, which normally works only with low-level languages like C/C++. Since I mostly only use R, here are some collections of my code to read/modify BAM file.'
---

## Read BAM into R

I previously use samtools/sambamba to do it, but now I found a pretty good tool [GenomicAlignments](https://bioconductor.org/packages/release/bioc/html/GenomicAlignments.html). Below are some useful key code I mostly copy-paste.

The below code will extract all `mated` reads from BAM file. Defaultly there is no "seq" included.

```R
library("GenomicAlignments")

ga_pairs <- readGAlignmentPairs(bam_path, 
                                use.names = TRUE, 
                                param = ScanBamParam(which=bedToGrange, what=c("qname", "mapq", "cigar", "rname", "pos", "isize",
                                                            "seq", "mate_status", "qual")))
```
The bedToGrange object is very useful and can define what area of Genome I want to extract. The `ScanBamParam` can be used even more to do detailed filtering. To find out "what" attributes from bam are importable, use function `scanBamWhat`:

```R
> scanBamWhat()
 [1] "qname"       "flag"        "rname"       "strand"      "pos"         "qwidth"      "mapq"       
 [8] "cigar"       "mrnm"        "mpos"        "isize"       "seq"         "qual"        "groupid"    
[15] "mate_status"
> 
```

If want to extract all reads, use function `ga_reads <- readGAlignments(bam_path)`. 

To extract columns from it, use some build functions like:

```R
# Get all chr
seqnames(ga_pairs)

# Get length of each chr
seqlengths(ga_pairs)

# get unique name of chr
seqlevels(ga_pairs)

# cigar ONLY works for reads, not pairs
cigar(ga_reads)
```

Then I normally change the S4 to data.table.