---
slug: '/notes/Liftover-VCF-from-hg37-to-hg38-with-Picard'
date: '2022-08-14'
title: 'Liftover VCF from hg37 to hg38 with Picard'
tags: ['VCF', "Liftover"]
abstract: 'In my recent task, I need to compare a set of VCF generated from hg37, with another set of VCF generated from hg38. Thus, I need to liftover those hg37-version VCF to hg38. The solution I found is using Picard.'
---

Liftover is a common action to deal with genomic result generated from different verison of reference. VCF files are generated from reference-mapped BAM file, thus they are influence as well. I googled a bit, one solution I can use is [Picard](https://gatk.broadinstitute.org/hc/en-us/articles/360037060932-LiftoverVcf-Picard-).

I downloaded the latest version of Picard from [here](https://github.com/broadinstitute/picard/releases/tag/2.27.4) into current folder.

Then the code is:

```bash
java -jar picard.jar LiftoverVcf \
     I=../S02_DownloadOldVCFs/OldVCFs/uk35C650/FR07961001.pass.recode.vcf.gz \
     O=./Lifted/uk35C650_LiftOver.vcf \
     CHAIN=b37ToHg38.over.chain \
     REJECT=./Lifted/uk35C650_rejected_variants.vcf \
     R=./Homo_sapiens_assembly38.fasta
```
Among them, `I` and `O` are input and output. 
* `CHAIN` represent liftover chain file, in my case, I am lifting over from hg37 to hg38, thus I download file from [here](https://raw.githubusercontent.com/broadinstitute/gatk/master/scripts/funcotator/data_sources/gnomAD/b37ToHg38.over.chain). I am not 100% sure this is the best link, I found similar access from [UCSC hgTable](https://hgdownload.cse.ucsc.edu/goldenpath/hg19/liftOver/).

* `REJECT` represent a vcf file to save vcf record can't be lifted. This is MUST parameter, any point to a random file would work.
* `R` means the **new target reference** you are lifting for. In my case, I want to lift it to hg38, thus I am using a hg38 reference as target reference. Note that this can't be zipped file.

Below is the final results in `Lifted` folder:

```bash
$ ls -lhat
total 357M
-rw-rw-r-- 1 tian tian 5.5M Aug 14 22:04 uk35C650_old_lifted_over.vcf.idx
drwxrwxr-x 2 tian tian  120 Aug 14 22:04 .
-rw-rw-r-- 1 tian tian 348M Aug 14 22:04 uk35C650_old_lifted_over.vcf
-rw-rw-r-- 1 tian tian 3.8M Aug 14 22:04 uk35C650_rejected_variants.vcf
drwxrwxr-x 4 tian tian 4.0K Aug 14 19:44 ..
```

Finally, I follow [this post](https://www.biostars.org/p/59492/) for VCF file lifting.