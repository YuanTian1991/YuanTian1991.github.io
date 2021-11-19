---
slug: '/notes/Analysis-RRBS-with-GemBS'
date: '2021-11-18'
title: 'Analysis RRBS with GemBS'
tags: ['RRBS', "Pipeline"]
abstract: 'One of my recent project is to run RRBS analysis, with GemBS. These are some code I recorded during my analyais.'
---

So I am working on a RRBS data set, I want to use GemBS to analysis it. First step is to install GemBS in the Ubuntu system. It looks easy but indeed have something worth recording.

## 1. Install GemBS3

Following the [instruction](http://statgen.cnag.cat/gemBS/v3/UserGuide/_build/html/installation.html), I started the installation.

First error I encountered is:

```bash
/usr/local/cuda/bin/nvcc -O3 -m64 -Xptxas="-dlcm=ca" -gencode arch=compute_20,code=\"sm_20,compute_20\" -gencode arch=compute_20,code=sm_21 -gencode arch=compute_30,code=sm_30 -gencode arch=compute_35,code=\"sm_35,compute_35\" -gencode arch=compute_37,code=sm_37 -gencode arch=compute_50,code=\"sm_50,compute_50\" -gencode arch=compute_52,code=\"sm_52,compute_52\" -gencode arch=compute_60,code=\"sm_60,compute_60\" -gencode arch=compute_61,code=\"sm_61,compute_61\" -gencode arch=compute_62,code=\"sm_62,compute_62\" -c src/gpu_fmi_decode.cu -o build/gpu_fmi_decode.o
nvcc fatal : Unsupported gpu architecture 'compute_20'
```

It's a error related with CUDA platform, after google online, I found the the solution is to **manually change Makefile**: Enter folder tools/gem3-mapper/resources/gem-cutter, then I use vim to change Makefile. Comment the first two line of code.

```bash
## Force to test JIT compiler:
## export CUDA_FORCE_PTX_JIT=1
# CUDA_SASS_FLAG_20=-gencode arch=compute_20,code=\"sm_20,compute_20\" -gencode arch=compute_20,code=sm_21
# CUDA_SASS_FLAG_30=$(CUDA_SASS_FLAG_20) -gencode arch=compute_30,code=sm_30 -gencode arch=compute_35,code=\"sm_35,compute_35\"
CUDA_SASS_FLAG_37=$(CUDA_SASS_FLAG_30) -gencode arch=compute_37,code=sm_37
CUDA_SASS_FLAG_50=$(CUDA_SASS_FLAG_37) -gencode arch=compute_50,code=\"sm_50,compute_50\"
CUDA_SASS_FLAG_52=$(CUDA_SASS_FLAG_50) -gencode arch=compute_52,code=\"sm_52,compute_52\"
CUDA_SASS_FLAG_60=$(CUDA_SASS_FLAG_52) -gencode arch=compute_60,code=\"sm_60,compute_60\" -gencode arch=compute_61,code=\"sm_61,compute_61\" -gencode arch=compute_62,code=\"sm_62,compute_62\"
```

Then I can start installation:

```
python3 setup.py install --prefix=/my/install/path/ --exec-prefix=/my/install/path/
```

Above command could help me to install GemBS into any folder without root, and will not mess up whole system's software eco-system. Finally, add the path into .bashrc for future usage.

## 2. Install GemBS4

Another option is to install [GemBS4](https://github.com/heathsc/gemBS-rs).

```bash
git clone --recursive https://github.com/heathsc/gemBS-rs.git
cd gemBS-rs
```

Then I modified `gemBS_config.mk.in` file to my own install path. Also, I need to fix the CUDA error in `.../gemBS-rs/c_tools/gem3-mapper/resources/gem-cutter/Makefile`, commend the compute_20 and compute_30. Then run:

```
make gemBS_config.mk
make install
```

Also, I need to add the path into my .bashrc. However, after installation, I found actually GemBS-rs have some problem in Samtools, missing `hts_test_feature`, so for the analysis, I still use GemBS 3.

## 2. GemBS Prepare

The file I have are trimmed fastq files, so I can start to use GemBS since here. According to the [guild](http://statgen.cnag.cat/GEMBS/UserGuide/_build/html/pipelineConfig.html), I should prepare two things below. Also, I need to prepare the genome for mapping.
* Sample metadata (in the metadata CSV file)
* Pipeline parameters (in the pipeline configuration file)

So I composed a `SampleSheet.cs`v file in the folder, only listed file_id, fastq file information .etc since I currently don't know the phenotype. Note that phenotype can be added on the last column.

```R
> knitr::kable(SampleSheet)

|Barcode   |file_id   |end_1              |end_2              |
|:---------|:---------|:------------------|:------------------|
|H78_0001  |H78_0001  |H78_0001_R1.fq.gz  |H78_0001_R2.fq.gz  |
|H78_0008  |H78_0008  |H78_0008_R1.fq.gz  |H78_0008_R2.fq.gz  |
|H78_0009  |H78_0009  |H78_0009_R1.fq.gz  |H78_0009_R2.fq.gz  |
|H78_0010  |H78_0010  |H78_0010_R1.fq.gz  |H78_0010_R2.fq.gz  |
|H78_0011  |H78_0011  |H78_0011_R1.fq.gz  |H78_0011_R2.fq.gz  |
|H78_0012  |H78_0012  |H78_0012_R1.fq.gz  |H78_0012_R2.fq.gz  |
|H78_0013  |H78_0013  |H78_0013_R1.fq.gz  |H78_0013_R2.fq.gz  |
|H78_0014  |H78_0014  |H78_0014_R1.fq.gz  |H78_0014_R2.fq.gz  |
|H78_0015  |H78_0015  |H78_0015_R1.fq.gz  |H78_0015_R2.fq.gz  |
|I18_1_001 |I18_1_001 |I18_1_001_R1.fq.gz |I18_1_001_R2.fq.gz |
|I18_1_002 |I18_1_002 |I18_1_002_R1.fq.gz |I18_1_002_R2.fq.gz |
...
```

Then I prepare config file. Firstly I downloaded original file from [official github](https://github.com/heathsc/gemBS-rs/tree/master/etc/config_scripts). Then modify it a bit, just add the path of my fq files, and reference file [hg38.fa.gz I downloaded from USCS](https://hgdownload.cse.ucsc.edu/goldenpath/hg38/bigZips/).

```bash
base = ./result/

reference = ./hg38.fa.gz
index_dir = indexes

sequence_dir = /scratch1/cansor/analysis_nov21/trimmed_fastq    # @SAMPLE and @BARCODE are special
bam_dir = ${base}/mapping/@BARCODE      # variables that are replaced with
bcf_dir = ${base}/calls/@BARCODE        # the sample name or barcode being
extract_dir = ${base}/extract/@BARCODE  # worked on during gemBS operation
report_dir = ${base}/report

# General project info
project = Cansor
species = Human

# Default parameters
threads = 40
jobs = 4

... # All the rest are unmodified.
```

## 3. Run GemBS

After above preperation, we can start to run GmeBS, it's super easy, first step is to `prepare`:

```bash
gemBS prepare -c IHEC_RRBS.conf -t SampleSheet.csv
```

Firstly I need to index the reference genome:

```bash
gemBS index
```

Then, start mapping. Mapping in gemBS is performed using GEM3 in bisulfite mode. After I run it, each bam file will be placed in the mapping folder.

```bash
gemBS map
```

Then start calling methylation status with [bs_call](https://github.com/heathsc/bs_call). It take account of the sequence quality scores, under and over conversion probabilities and the observed bases, bs_call finds the most likely genotype (maximizing the likelihood over the unknown methylation parameter for each genotype) and then reports the methylation conditional on the called genotype. The output are `*.bcf` files in calls `folder`.

```bash
gemBS call
```
We can use `bcftools` to check those files, `bcftools view I18_1_003.bcf`. I am not sure what are all column means, need to read the tutorial better in the future.
```
chr8_KI270900v1_alt	250389	.	C	.	20	PASS	CX=GACTC	GT:FT:DP:MQ:GQ:QD:GL:MC8:AMQ:CS:CG:CX	0/0:PASS:8:60:20:2:-0.00380238:0,8,0,0,0,0,0,0:37:+:N:GACTC
chr8_KI270900v1_alt	250391	.	C	.	20	PASS	CX=CTCGG	GT:FT:DP:MQ:GQ:QD:GL:MC8:AMQ:CS:CG:CX	0/0:PASS:8:60:20:2:-0.00380238:0,8,0,0,0,0,0,0:37:+:C:CTCGG
chr8_KI270900v1_alt	250392	.	G	.	20	PASS	CX=TCGGG	GT:FT:DP:MQ:GQ:QD:GL:MC8:AMQ:CS:CG:CX	0/0:PASS:0:60:20:20:-0.00380249:0,0,0,0,0,0,8,0:37:-:C:TCGGG
chr8_KI270900v1_alt	250393	.	G	.	2	fail	CX=CGGGC	GT:FT:DP:MQ:GQ:QD:GL:MC8:AMQ:CS:CG:CX	0/0:q20:0:60:2:2:-0.367877:0,0,0,0,8,0,0,0:37:-:N:CGGGC
chr8_KI270900v1_alt	250394	.	G	.	2	fail	CX=GGGCA	GT:FT:DP:MQ:GQ:QD:GL:MC8:AMQ:CS:CG:CX	0/0:q20:0:60:2:2:-0.367877:0,0,0,0,8,0,0,0:37:-:N:GGGCA
chr8_KI270900v1_alt	250395	.	C	.	20	PASS	CX=GGCAT	GT:FT:DP:MQ:GQ:QD:GL:MC8:AMQ:CS:CG:CX	0/0:PASS:8:60:20:2:-0.00380238:0,8,0,0,0,0,0,0:37:+:N:GGCAT
chr8_KI270900v1_alt	250398	.	G	.	2	fail	CX=ATGAG	GT:FT:DP:MQ:GQ:QD:GL:MC8:AMQ:CS:CG:CX	0/0:q20:0:60:2:2:-0.367877:0,0,0,0,8,0,0,0:37:-:N:ATGAG
chr8_KI270900v1_alt	250400	.	G	.	2	fail	CX=GAGAC	GT:FT:DP:MQ:GQ:QD:GL:MC8:AMQ:CS:CG:CX	0/0:q20:0:60:2:2:-0.367877:0,0,0,0,8,0,0,0:37:-:N:GAGAC
chr8_KI270900v1_alt	250402	.	C	.	20	PASS	CX=GACCC	GT:FT:DP:MQ:GQ:QD:GL:MC8:AMQ:CS:CG:CX	0/0:PASS:8:60:20:2:-0.00380238:0,8,0,0,0,0,0,0:37:+:N:GACCC
chr8_KI270900v1_alt	250403	.	C	.	20	PASS	CX=ACCCC	GT:FT:DP:MQ:GQ:QD:GL:MC8:AMQ:CS:CG:CX	0/0:PASS:8:60:20:2:-0.00380238:0,8,0,0,0,0,0,0:37:+:N:ACCCC
chr8_KI270900v1_alt	250404	.	C	.	20	PASS	CX=CCCCA	GT:FT:DP:MQ:GQ:QD:GL:MC8:AMQ:CS:CG:CX	0/0:PASS:8:60:20:2:-0.0038029:0,8,0,0,0,0,0,0:36:+:N:CCCCA
chr8_KI270900v1_alt	250405	.	C	.	20	PASS	CX=CCCAT	GT:FT:DP:MQ:GQ:QD:GL:MC8:AMQ:CS:CG:CX	0/0:PASS:8:60:20:2:-0.00380238:0,8,0,0,0,0,0,0:37:+:N:CCCAT
chr8_KI270900v1_alt	250410	.	C	.	20	PASS	CX=TACGG	GT:FT:DP:MQ:GQ:QD:GL:MC8:AMQ:CS:CG:CX	0/0:PASS:8:60:20:2:-0.00380238:0,8,0,0,0,0,0,0:37:+:C:TACGG
chr8_KI270900v1_alt	250411	.	G	.	20	PASS	CX=ACGGG	GT:FT:DP:MQ:GQ:QD:GL:MC8:AMQ:CS:CG:CX	0/0:PASS:0:60:20:20:-0.00380249:0,0,0,0,0,0,8,0:37:-:C:ACGGG
chr8_KI270900v1_alt	250412	.	G	.	2	fail	CX=CGGGC	GT:FT:DP:MQ:GQ:QD:GL:MC8:AMQ:CS:CG:CX	0/0:q20:0:60:2:2:-0.367877:0,0,0,0,8,0,0,0:36:-:N:CGGGC
chr8_KI270900v1_alt	250413	.	G	.	2	fail	CX=GGGCC	GT:FT:DP:MQ:GQ:QD:GL:MC8:AMQ:CS:CG:CX	0/0:q20:0:60:2:2:-0.367877:0,0,0,0,8,0,0,0:37:-:N:GGGCC
chr8_KI270900v1_alt	250414	.	C	.	20	PASS	CX=GGCCT	GT:FT:DP:MQ:GQ:QD:GL:MC8:AMQ:CS:CG:CX	0/0:PASS:8:60:20:2:-0.00380238:0,8,0,0,0,0,0,0:37:+:N:GGCCT
```

Then extract methylation data.

```bash
gemBS extract
```