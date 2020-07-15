---
slug: '/notes/R-Tip-biomaRt-for-gene-annotation'
date: '2020-07-15'
title: 'R Tip: biomaRt for gene annotation'
tags: ['Annotation', 'R', 'Bioinformatic']
abstract: 'I just simply want to find a annotation (for a easy species - human) with various gene name matched. This task wasted me about 1 hour, and I tried various way, some even very outdated. Eventually I think biomaRt work, so I record here a bit.'
---

**I realy don't know, why we have so many various gene name?** Below is an example...

symbol name:  `TP53`;
ensembl\_gene\_id: `ENSG00000141510`;
entrezgene_id: `7157`;

I am just so tried of mapping between these names again and again. I found [biomaRt](https://www.bioconductor.org/packages/devel/bioc/vignettes/biomaRt/inst/doc/biomaRt.html) a really good tool for annotation. Below is a code snippets I used to find human gene annotation, merely I need the start, end, chromosome_name for each gene, to overlap with discovered methylation signals.

```R
library(biomaRt)
mart <- useMart("ensembl", dataset = "hsapiens_gene_ensembl")
genes <- getBM(
  attributes=c("chromosome_name",
               "start_position",
               "end_position", 
               "ensembl_gene_id",
               "entrezgene_id", 
               "external_gene_name"),
  mart = mart)
colnames(genes) <- c("chr", "start", "end", "ensembl_gene_id", "entrezgene_id",  "SYMBOL")
genes$chr <- paste0("chr", genes$chr)
```

The result is exactly what I want:

```R
> head(genes)
       chr start  end ensembl_gene_id entrezgene_id  SYMBOL
1 chrchrMT   577  647 ENSG00000210049            NA   MT-TF
2 chrchrMT   648 1601 ENSG00000211459            NA MT-RNR1
3 chrchrMT  1602 1670 ENSG00000210077            NA   MT-TV
4 chrchrMT  1671 3229 ENSG00000210082            NA MT-RNR2
5 chrchrMT  3230 3304 ENSG00000209082            NA  MT-TL1
6 chrchrMT  3307 4262 ENSG00000198888          4535  MT-ND1
```

I don't know why in above figure, **Na value exact in entrezgene_id column**...they are not mathced with each other? I need to find out one day...

More importantly, by using biomaRt, I can extra more columns. The all possible `attribute` (means columns above)

Below is an example. If I want extra column I can search below list.

```R
> head(listAttributes(mart))
                           name                  description         page
1               ensembl_gene_id               Gene stable ID feature_page
2       ensembl_gene_id_version       Gene stable ID version feature_page
3         ensembl_transcript_id         Transcript stable ID feature_page
4 ensembl_transcript_id_version Transcript stable ID version feature_page
5            ensembl_peptide_id            Protein stable ID feature_page
6    ensembl_peptide_id_version    Protein stable ID version feature_page
```

Note that if a column like transcript_id is selected, gene names would be duplicated for splicing transcripts. It's a good design.