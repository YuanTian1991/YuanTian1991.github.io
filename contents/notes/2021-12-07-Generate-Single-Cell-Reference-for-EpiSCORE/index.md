---
slug: '/notes/Generate-Single-Cell-Reference-for-EpiSCORE'
date: '2021-12-07'
title: 'Generate Single Cell Reference for EpiSCORE'
tags: ['cell-type-deconvolution', 'methylation']
abstract: 'This is my trace back on how to reproduce EpiSCORE single cell matrix, I will use this note to create tissue cell type fraction matrix in the future.'
---

Previously I have recorded [how to use methylCIBERSORT for cell type deconvolution](https://yuantian1991.github.io/notes/Using-MethylCIBERSORT-for-Cell-Type-Deconvolution), which is easy to use but this time I want to use [EpiSCORE](https://github.com/aet21/EpiSCORE). The idea of EpiSCORE is to use single-cell RNA-seq data as surrogate of methylation data (the underlying assumption is that a group of genes in each cell line to show high correlation between expression and methylation), then "infer" corresponding methylation reference. So in situations that we don't have corresponding purified cell type methylation reference for cell type deconvolution, for example using CIBERSORT, Projection, or any other algorithms, EpiSCORE will use corresponding single-cell RNA-seq expression value (only those high correlation genes), to "tranform" into a methylation reference, then use this "inferred" reference for cell type deconvolution.

Honestly, all cell type deconvolution methods are black boxes to me... they are hard to be trace back or visualised. When I have time, I will create some In silico data for test.

One key thing I need to find out is how to reproduced the EpiSCORE reference. It only provided some reference in the package, but I think I need more.

## 1. Demo Data in EpiSCORE

After loading the library, there is a default single-cell RNA-seq data can be loaded, **however, this data set (15845 genes across 1641 single cell) contains only 4 cell types: Epi Endo Fib, and IC**.

```R
> library("EpiSCORE")
> dim(lungSS2mca1.m)
> table(names(celltypeSS2.idx))

 Endoth   Epith  Immune Stromal 
    693     138     387     423 
>
```

## 2. Get origin single-cell RNA-seq Expression data.

So since I am working on Glioblastoma, I can't use this reference. I need look for the reference deeper. According to the EpiSCORE paper, the single-cell data were obtained from [this link](https://tabula-muris.ds.czbiohub.org/). More specifically, I downloaded both the annotation file (annotations_FACS.
csv) and FACTS.zip files. In theory, the demo `lungSS2mca1` single cell RNA-seq data is generated from here. So I should be able to use them to generate more reference for EpiSCORE as I want.

Firstly I want to confirm my understanding is correct. In the unzip FACS.zip folder, there are many tissue's single cell expression data.

```bash
$ ls
Aorta-counts.csv          Brain_Non-Myeloid-counts.csv  Heart-counts.csv            Limb_Muscle-counts.csv  Mammary_Gland-counts.csv  Skin-counts.csv    Tongue-counts.csv
Bladder-counts.csv        Diaphragm-counts.csv          Kidney-counts.csv           Liver-counts.csv        Marrow-counts.csv         Spleen-counts.csv  Trachea-counts.csv
Brain_Myeloid-counts.csv  Fat-counts.csv                Large_Intestine-counts.csv  Lung-counts.csv         Pancreas-counts.csv       Thymus-counts.csv

```

So, I suspect above lung demo data is generated from `Lung-counts.csv`, however, after loading, I noticed this table actually have 23433 genes and 1924 cells.  All cell line's name (colname) can be find in the annotation file (annotations_FACS.csv) below (first column), **which contains tissue and cell_ontology_class to check.**. So I suspect to create the demo, the author only select 4 types of cells, but actually the Lung-counts have more types of cells contained.

```R
> knitr::kable(head(anno))

|cell                    |tissue |cell_ontology_class  |cell_ontology_term_iri                    |cell_ontology_id |
|:-----------------------|:------|:--------------------|:-----------------------------------------|:----------------|
|A21.MAA000594.3_8_M.1.1 |Aorta  |fibroblast           |http://purl.obolibrary.org/obo/CL_0000057 |CL:0000057       |
|F8.MAA000594.3_8_M.1.1  |Aorta  |unknown              |NA                                        |CL:.             |
|H11.MAA000594.3_8_M.1.1 |Aorta  |unknown              |NA                                        |CL:.             |
|A22.MAA000594.3_8_M.1.1 |Aorta  |unknown              |NA                                        |CL:.             |
|H12.MAA000594.3_8_M.1.1 |Aorta  |epicardial adipocyte |http://purl.obolibrary.org/obo/CL_1000309 |CL:1000309       |
|L9.MAA000594.3_8_M.1.1  |Aorta  |unknown              |NA                                        |CL:.             |
> 
```

A quick validation of my idea. By checking, indeed all columns (cells) in lungSS2mca1.m data can be find in the annotation. **However, some cell types are merged into only 4 cell types.**

```R
> tmp2 <- anno[match(colnames(lungSS2mca1.m), anno$cell),]
> table(tmp2$cell_ontology_class, celltypeSS2.idx)
                                                 celltypeSS2.idx
                                                    1   2   3   4
  B cell                                            0   0   0  57
  ciliated columnar cell of tracheobronchial tree  25   0   0   0
  classical monocyte                                0   0   0  90
  epithelial cell of lung                         113   0   0   0
  lung endothelial cell                             0 693   0   0
  monocyte                                          0   0   0  65
  myeloid cell                                      0   0   0  85
  natural killer cell                               0   0   0  37
  stromal cell                                      0   0 423   0
  T cell                                            0   0   0  53
>
> # 1 is Epith; 2 is Endoth; 3 is Stromal; 4 is Immune.
> table(tmp2$tissue)
Lung 
1545 
> 
```

## 3. Select cell types and tissues.

**Now it's more clear, if I want to research on certain tissues, I need to firstly find corresponding tissue in this table, then select cell lines I am interested.** Below are all avaliable tissues.

```R
> table(anno$tissue)

          Aorta         Bladder Brain_Microglia   Brain_Neurons           Colon 
            364            1287            4365            3000            3459 
      Diaphragm             Fat           Heart          Kidney           Liver 
            870            4709            4221             517             710 
           Lung         Mammary          Marrow          Muscle        Pancreas 
           1620            2304            4897            1067            1327 
           Skin          Spleen          Thymus          Tongue         Trachea 
           2263            1689            1283            1394             846 
> 
```

Now I am working on Glioma data, so I want to get corresponding `Brain_Microglia` or `Brain_Neurons` cells (maybe I can merge them togather?)

```R
> table(anno[which(anno$tissue == "Brain_Microglia"), "cell_ontology_class"])

     macrophage microglial cell 
             36            4329 
> table(anno[which(anno$tissue == "Brain_Neurons"), "cell_ontology_class"])

astrocyte of the cerebral cortex              Bergmann glial cell 
                             403                               30 
                  brain pericyte                 endothelial cell 
                             132                              625 
                          neuron               neuronal stem cell 
                             196                               36 
                 oligodendrocyte   oligodendrocyte precursor cell 
                            1186                              202 
              smooth muscle cell                          unknown 
                              14                              176 
> 
```

## 4. Mosue to Human gene name mapping

Apart from the annotation (columns), rownames are also need to be checked the sc-RNAseq data are from Mouse, but we are working on human, so I need to find a way convert the mouse name (first two in each csv file) into human symbol. I coded a quick script to do it:

```R
LungCounts <- read.csv("./FACS/Lung-counts.csv", header=TRUE, row.names=1)
# rownames(LungCounts) <- toupper(rownames(LungCounts))
mm <- read.csv("http://www.informatics.jax.org/downloads/reports/HOM_MouseHumanSequence.rpt", header=T, sep="\t")
matchIndex <- mm[match(rownames(LungCounts), mm$Symbol),"DB.Class.Key"]
mHuman <- mm[mm$"DB.Class.Key" %in% matchIndex & mm$"Common.Organism.Name" == "human", c("DB.Class.Key", "Symbol")]
mMouse <- mm[mm$"DB.Class.Key" %in% matchIndex & mm$"Common.Organism.Name" == "mouse, laboratory", c("DB.Class.Key", "Symbol")]
Mouse2Human <- merge(mMouse, mHuman,by="DB.Class.Key")
Mouse2Human <- Mouse2Human[Mouse2Human$Symbol.y %in% names(which(table(Mouse2Human$Symbol.y) == 1)),]
```

## 5. Normalisation Count Matrix

After running this script, I can get `Mouse2Human` object, which is a perfect name match between human to mouse. Finally, according to the paper, the origin RNA-seq matrix (LungCounts above) need to be normalised:

```R
W <- LungCounts
for(i in 1:ncol(LungCounts)) W[,i] <- W[,i] * 5531351 / sum(W[,i]) # for 1
log2(W + 1)
```

## 6. Compare between my result with the demo data

So finally, I replace the `W` matrix (normalised lungCounts) rowname to mouse (I know the code is quite ugly here):

```R
A <- Mouse2Human[match(rownames(LungCounts), Mouse2Human$Symbol.x), "Symbol.y"]
index <- which(!is.na(A))
W2 <- W[index,]
rownames(W2) <- A[index]
```

That's it! Finally I can quickly compare my result with the demo `lungSS2mca1` data provided by EpiSCORE package. Below is the origin demo matrix.

```R
> lungSS2mca1.m[5:10,1:5]
        A1.MAA000526.3_9_M.1.1 A1.MAA000530.3_8_M.1.1 A1.MAA001847.3_39_F.1.1
A4GALT                0.000000               0.000000                       0
A4GNT                 0.000000               0.000000                       0
AAAS                  0.000000               0.000000                       0
AACS                  1.887504               3.401663                       0
AADAC                 0.000000               0.000000                       0
AADACL2               0.000000               0.000000                       0
        A1.MAA001889.3_38_F.1.1 A1.MAA001892.3_38_F.1.1
A4GALT                        0                       0
A4GNT                         0                       0
AAAS                          0                       0
AACS                          0                       0
AADAC                         0                       0
AADACL2                       0                       0
```

Below is my preprocessed matrix.

```R
> W2[c("A4GALT", "A4GNT", "AAAS", "AACS", "AADAC", "AADACL2"), c("A1.MAA000526.3_9_M.1.1", "A1.MAA000530.3_8_M.1.1", "A1.MAA001847.3_39_F.1.1", "A1.MAA001889.3_38_F.1.1", "A1.MAA001892.3_38_F.1.1")]
        A1.MAA000526.3_9_M.1.1 A1.MAA000530.3_8_M.1.1 A1.MAA001847.3_39_F.1.1
A4GALT                0.000000               0.000000                       0
A4GNT                 0.000000               0.000000                       0
AAAS                  0.000000               0.000000                       0
AACS                  1.921577               3.404416                       0
AADAC                 0.000000               0.000000                       0
AADACL2               0.000000               0.000000                       0
        A1.MAA001889.3_38_F.1.1 A1.MAA001892.3_38_F.1.1
A4GALT                        0                       0
A4GNT                         0                       0
AAAS                          0                       0
AACS                          0                       0
AADAC                         0                       0
AADACL2                       0                       0
> 
```

That's is, in the future I can use above solution to generate all cell type reference for EpiSCORE. Still it's too complicate, I think I will try write a script to do it...

---

```R
> knitr::kable(head(estF.o$estF))

|            |    neuron|     Oligo|     Astro|       OPC|      Endo| Microglia|
|:-----------|---------:|---------:|---------:|---------:|---------:|---------:|
|GCGR-E1     | 0.0174422| 0.0380976| 0.4534784| 0.1473080| 0.3436738| 0.0000000|
|GCGR-E1_PT  | 0.0000000| 0.0000000| 0.3858507| 0.1479975| 0.4661518| 0.0000000|
|GCGR-E10    | 0.0000000| 0.0000000| 0.1366966| 0.6184098| 0.2200949| 0.0247987|
|GCGR-E10_PT | 0.0000000| 0.0000000| 0.2124682| 0.2837996| 0.5037322| 0.0000000|
|GCGR-E12    | 0.0000000| 0.0000000| 0.0740341| 0.5295187| 0.2657846| 0.1306626|
|GCGR-E12_PT | 0.0407090| 0.0000000| 0.2162089| 0.2263986| 0.5166835| 0.0000000|
> dim(estF.o$estF)
[1] 167   6
> 
```