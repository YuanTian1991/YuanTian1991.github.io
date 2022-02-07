---
slug: '/notes/Nextflow:-nf-core-sarek'
date: '2022-01-27'
title: 'Nextflow: nf-core sarek'
tags: ['nextflow', 'WGS']
abstract: 'For many years I want to learn nextflow, never got a chance, now it is time. My task it to run nf-core sarek on PGP-UK WGS/WES data. Also it is my first time try to call SNP information out of WGS data.'
---

So [nextflow](https://www.nextflow.io/) is a tool to "link" various of software, to chain them up into a "pipeline", for data analysis. This is a definition and understanding from my side. It looks like this tools is specificaly designed for tasks like Bioinformatic, which relies on various of open source softwares, scripts, packages or libraries. Different software would create different output and require different input, so nextflow would "arrange" and "link" these input/output correctly.

So, in theory, if I develop a nextflow pipeline, it should be able to run analysis on corresponding data smoothly. However, in practice, I guess it can't be that easy and softwares may upgrade, and a pipeline may need to be upgraded again and again...

## 1. Installation of nextflow

Anyway, firstly I need to install and try nextflow a bit, by following the here. It's super simple, just **make sure I have java installed**. Then type one command in the folder I want the nextflow installed. In my case, I put it in Software folder under my working directory, it's where I put all software I need for work.

```bash
curl -s https://get.nextflow.io | bash
```

I know there are other ways like Github or Bioconda for installation, but I did not try them. Finally, I add the path of nextflow in my bash. The way to run test data is quite simple:

```bash
nextflow run hello
```
After typing this command, it looks nextflow will directly download file from internet, and start running. Well...then I need to figure out how to config input.

> Actually, a feature for nextflow I like is `resume`, which allow nextflow pipeline to rerun the modified or unfinished part, without rerun whole pipeline.

## 2. Run nf-core sarek

Apparently, someone would get the idea that they write "perfect" next-flow first, then publish it online for everyone to use. [nf-core](https://nf-co.re/) is exactly a platform for this. They provided a list (roughtly 50) nextflow pipeline for different bioinformatic data analysis, for example, sarek for WGS analysis, rnaseq fo RNA-seq analysis .etc

In my work (UK Personal Genomic Project), I would start with WGS analysis, by using [nf-core sarek](https://nf-co.re/sarek) analysis. In the future, I may try other pipeline like WGBS, Methylation .etc Like the above test demo from nextflow, the way to run sarek is also just one command, so I guess the key thing here is to figure out input.

### 2.1. Create SampleSheet.tsv

[The usage of nf-core sarek](https://nf-co.re/sarek/2.7.1/usage) is here. In theory, **the only thing I should do it to create a tsv file**, which is a tab separated normal file.

```bash
ERR1726424  XY  0   ERR1726424  group_1 /scratch1/Tian/PGP/1.DownloadWGS/WGS/ERR1726424_1.fastq.gz  /scratch1/Tian/PGP/1.DownloadWGS/WGS/ERR1726424_2.fastq.gz
```

<b style="background-color: yellow">Note that this file MUST be tab separated. And the fastq files can't be raw fastq format. For example, it must be .gz format, which should be arranged from initial download moment.</b>

### 2.2. Modify docker profile

In theory, nf-core sarek run on docker or other contianer softwares. However, after tailed couple times trying and help from collegue, I know I need to add come extra line on the default profile config file located at `~/.nextflow/assets/nf-core/sarek/conf`. Add below lines at the bottom:

```
docker {
  enabled = true
  runOptions = " -v /scratch1/Tian/PGP/2.Sarek:/scratch1/Tian/PGP/2.Sarek"
}
```

Sadly now I don't know why just add the directory to docker.

### 2.3. Run nf-core command

Finally, below command could trigger sarek **for the first step**. There are some parameters can be used to accelerate like:

* `--cpus` as number of CpGs.
* `-resume` to restart unfinished pipeline.
* `--single_cpu_mem`, each CpG's memory. For example 456.GB. 
* `--max_memory`, total memory size. For example 1900.GB.

```bash
nextflow run nf-core/sarek --input SampleSheet.tsv -profile docker --cpus 30
```

It works for me, it took me 15h 55m to finish just one WGS data. Well, at least it's a good start. Out of my expectation, this is just the first step, for the rest, we should step-by-step run other steps. For example, the second step is to do variant calling.

```bash
nextflow run nf-core/sarek --input /scratch1/Tian/PGP/2.Sarek/results/Preprocessing/TSV/recalibrated.tsv -profile docker -resume --step variant_calling --cpus 30 --tools 'HaplotypeCaller,Manta,Strelka'
```

After above command, vcf files are generated in different folder in Variant folder. Final step is to annotate them with below command:

```bash
nextflow run nf-core/sarek --input "results/VariantCalling/*/{HaplotypeCaller,Manta,Strelka}/*.vcf.gz" -profile docker -resume --step annotate --tools merge --cpus 30
```

That's it, these are commands can be used to run nf-core sarek. It contains so much software/steps that I should spend time to check on them.