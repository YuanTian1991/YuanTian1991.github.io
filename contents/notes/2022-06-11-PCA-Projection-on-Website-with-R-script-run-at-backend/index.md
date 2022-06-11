---
slug: '/notes/PCA-Projection-on-Website-with-R-script-run-at-backend'
date: '2022-06-11'
title: 'PCA Projection on Website with R script run at backend'
tags: ['R', 'React', 'Full-Stack']
abstract: 'It is so common to draw PCA plot in Bioinformatic world. And it is cool to allow a PCA model to be able to do projection on new data onto the origin plot, thus new users will know how their new data is going to be clusteredw with old PCA plot. I managed to create a single front to backend webpage to do it online.'
---

It's a very common and useful way to do PCA on Genomics data, which will reduce data dimentions and give user clear clustering on samples. However, PCA can also be seen as a tool similar as "Machine Learning", allow user to "project" new data onto the plot. By doing so, we can have a clear look now new clustering status between new data with old PCA plot.

## 1. How to PCA Projection with R?

Firstly, I need to figure out how to do PCA projection with R. Initially I found simple `predict` function can do it:

```R
# perform principal components analysis
pca <- prcomp(t(trainData), retx=TRUE, center=TRUE, scale=TRUE)

# project new data onto PCA plot.
pred <- predict(pca, newdata=t(testData))
```

Above code works, and for both `pca` and `pred`, we only want the PC1 and PC2 value for plot, like below:

```R
expl.var <- round(pca$sdev^2/sum(pca$sdev^2)*100) # percent explained variance
pc <- c(1,2)
plot(pca$x[,pc], col="orange", cex=1.5, pch=2,
  xlab=paste0("PC ", pc[1], " (", expl.var[pc[1]], "%)"),
  ylab=paste0("PC ", pc[2], " (", expl.var[pc[2]], "%)")
)
points(pred[,pc], col="red", pch=19)
legend("topright", legend=levels(iris$Species), fill = COLOR, border=COLOR)
legend("topleft", legend=c("training data", "validation data"), col=1, pch=PCH)
```

**However, there is one shortage on above solution, which is the testData and trainData must be the same dimention.** This is not easy in reality, somethines user will have missing value, will have rows less than origin train data. In that case, this model will not be working. So, I need another solution that allow used to predict their PCA location with slightly different data. Eventually I found the solution in [this post](https://stats.stackexchange.com/a/108938/359939).

```R
# perform principal components analysis
pca <- prcomp(trainData) 

# project new data onto the PCA space
scale(testData, pca$center, pca$scale) %*% pca$rotation 
```

In above code, `pca$center`, `pca$scale` and `pca$rotation` are all matrix from the model `pca`, which represents the result deconvoluted from the origin training matrix. Their dimension is the same as origin training matrix, thus, if new test data have different dimention (rows) as origin training data. We just need to select common rows exist in both testData and trainData, then select corresponding sub-value and sub-matrix from `pca$center`, `pca$scale` and `pca$rotation`. Then the second equation would work.

## 2. Prepare Train and Test R script

### 2.1. Prepare Data

Now we get the solution, it's time to put it into practice. My genomic data is TPM matrix, with each row as a gene, and each column as a sample. Like blow:

```R
> Data[1:5,1:5]
              GCGR-E1     GCGR-E13  GCGR-E15     GCGR-E17     GCGR-E18
A1BG       3.01154140   0.29222439  1.772156   1.11747150   0.07848974
A1BG-AS1   3.19914417   0.08076186  3.183502   0.09265045   0.13015294
A1CF       0.01744144   0.03610510  0.000000   0.00000000   0.00000000
A2M      134.62404775 670.38225565 14.909394 472.77238869 407.79533387
A2M-AS1    0.00000000   0.23597086  0.715507   0.45117848   1.14084673
>
```
Also, I have pd data prepared. Each row in pd file represents one sample's status. Like it's phenotype, or other attributes like Region.

```R
> tail(pd)
               ID Pheno      Region
139 GCGR-NS18MD_A    NS     Medulla
140 GCGR-NS18SC_A    NS Spinal_Cord
141 GCGR-NS19CT_A    NS      Cortex
142 GCGR-NS19ST_A    NS    Striatum
143 GCGR-NS19ST_B    NS    Striatum
144   GCGR-NS20CT    NS      Cortex
```

### 2.2. Training Script

Then I worte a function to automaitcally get PCA model. Note that since I eventually will deploy it online. Thus, after trianing step, I will record the PC1 and PC2 value returned from tne PCA model. They will be used to draw scatter plot online. Along with PC1 and PC2 value, phenotype information and sample ID will be converted into JSON array all at once after calculation.

```R
library(jsonlite)

getPCA <- function(DataForPCA, pd=pd)
{
    zeroVaraintRowsMetastasis <- which(apply(DataForPCA, 1, var) == 0)
    if(length(zeroVaraintRowsMetastasis) >= 1) {
        DataForPCA <- DataForPCA[-zeroVaraintRowsMetastasis, ]
    }

    pca <- prcomp(t(DataForPCA), retx=TRUE, center=TRUE, scale=TRUE)

    # Export JSON for echart scatter plot visualisation
    df <- data.frame(ID=colnames(DataForPCA), PC1=pca$x[,1], PC2=pca$x[,2], pd)
    rownames(df) <- NULL

    convertedJSON <- toJSON(df)

    return(list(convertedJSON=convertedJSON, pcaModel=pca, df=df))
}

result <- getPCA(Data, pd[,2:3])
```

In the result object, `pcaModel` is the PCA model we will need to used for later prediction. It need to be saved into an R object separately for loading. `df` is PCA result along with Phenotype.

### 2.3. Testing Script

Finally I wrote a function for Testing:

```R
# # This script project new data onto 

load("./RScripts/PCAModel.RData")

getPred <- function(testData){

  rownames(testData) <- testData$GeneSymbol
  testData <- testData[,-1]

    message("Find matched gene name")
    matchIndex <- match(rownames(testData), rownames(exampleInput))
    formData <- testData[!is.na(matchIndex),]

    exampleIndex <- matchIndex[!is.na(matchIndex)]
    pred <- scale(t(formData), pcaModel$center[exampleIndex], pcaModel$scale[exampleIndex]) %*% pcaModel$rotation[exampleIndex,]

    df <- data.frame(ID=colnames(testData), PC1=pred[,1], PC2=pred[,2], Pheno="your samples", Region="your samples")
    rownames(df) <- NULL

    return(df)
}
```

To be continue...