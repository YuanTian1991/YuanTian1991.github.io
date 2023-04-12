---
slug: '/notes/Work-on-BAM-and-Sequence-file-with-R'
date: '2023-04-06'
title: 'Work on BAM and Sequence with R'
tags: ["R", "BAM", "String"]
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

## Convert origin Sequence to CIGAR-formated one

After spending hours writing the code, I suddenly found a very nice solution `sequenceLayer` [here](https://bioconductor.org/packages/release/bioc/manuals/GenomicAlignments/man/GenomicAlignments.pdf). This function directly convert the origin sequence into the cigar preprocessed sequence, including Insert/Deletion/Clips .etc. Below code will read the BAM file into R, and get reference-matchable sequence based on orighn sequence and cigar string.

```R
bam_path <- "path/to/Test.bam"

# Parse BAM files into data.table
ga_pairs <- readGAlignmentPairs(bam_path, 
                                use.names = TRUE, 
                                param = ScanBamParam(what=scanBamWhat())) %>% as.data.table()

# Get sequence without clip, insertion, deletion
first_seq <- sequenceLayer(DNAStringSet(ga_pairs$seq.first), ga_pairs$cigar.first)

```

## replaceAt/extractAt string

The `replaceAt` and `extractAt` function [here](https://www.bioconductor.org/packages/devel/bioc/manuals/Biostrings/man/Biostrings.pdf) is very useful to modify string based on locations.

```R
> x <- BString("abcdefghijklm")
> at1 <- IRanges(5:1, width=3)
> extractAt(x, at1)
BStringSet object of length 5:
    width seq
[1]     3 efg
[2]     3 def
[3]     3 cde
[4]     3 bcd
[5]     3 abc
```

The `replaceAt` function is powerful to cut or insert characters, but the action terms must be well organised a bit, like into IRange or other format.

```R
> replaceAt(x, c(1, 3, 4), value=c("+", "-", "+"))
16-letter BString object
seq: +ab-c+defghijklm
> 
```

## Concat two DNAStringSet / Subset Sequence

`xscat` function can be used to paste two DNAstringSet together. Also in the below code, I used `subseq` to select part of the string.

```R
forward_seq <- subseq(ov_seq_first[i_index], 1, tmp[i_index, sum_base])
back_seq <- subseq(ov_seq_first[i_index], tmp[i_index, sum_base] + tmp_count[i_index] + 1)

ov_seq_first[i_index] <- xscat(forward_seq, back_seq)
```

## Split CIGAR string

Below is my quick code to split CIGAR into label and count number

```R
cigar_label_first <- str_extract_all(ga_pairs$cigar.first, "[A-Z]")
cigar_count_first <- gsub("[A-Z]", "_", ga_pairs$cigar.first) %>% str_split("_")
```

Another way is to use cigar-util functions in GenomicAlignments package. The challenge is that after parsing, you will get a long list of IRanges, which seems not easy to do modification with loops.

```R
> cigarRangesAlongQuerySpace(ga_pairs$cigar.first)
IRangesList object of length 611822:
[[1]]
IRanges object with 2 ranges and 0 metadata columns:
          start       end     width
      <integer> <integer> <integer>
  [1]         1       100       100
  [2]       101       300       200

[[2]]
IRanges object with 2 ranges and 0 metadata columns:
          start       end     width
      <integer> <integer> <integer>
  [1]         1        39        39
  [2]        40       299       260

[[3]]
IRanges object with 2 ranges and 0 metadata columns:
          start       end     width
      <integer> <integer> <integer>
  [1]         1        53        53
  [2]        54       294       241

...
<611819 more elements>
```

## Find Overlap Regions between two Reads

Use `pintersect` function, note that the resolve.empty need to be set. After the calculation, with == 0 can be used to filter out empty overlap.

```R
first_ranges <- IRanges(start=ga_pairs$start.first, end=ga_pairs$end.first)
last_ranges <- IRanges(start=ga_pairs$start.last, end=ga_pairs$end.last)

intra_ranges <- pintersect(first_ranges, last_ranges, resolve.empty="max.start")
```

## Read Fastq File

I am using `readDNAStringSet` to read the raw reference genome into R. Similar functions are readBStringSet.etc

```R
ref_seq <- readDNAStringSet(ref_path)
```