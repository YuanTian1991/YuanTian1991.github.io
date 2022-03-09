---
slug: '/notes/My-Nextflow-Patterns'
date: '2022-03-09'
title: 'My Nextflow Patterns'
tags: ["nextflow"]
abstract: 'I am trying to collect some nextflow pattern I will frequently use here.'
---

## Input SampleSheet

Below is a simple csv file I will be used to develop the nextflow pipeline.

```bash
Barcode,file_id,end_1,end_2
S0066,S0066,S0066_EKDL210010479-1a-AK900-7UDI293_HV7M7DSX2_L4_1.fastq,S0066_EKDL210010479-1a-AK900-7UDI293_HV7M7DSX2_L4_2.fastq
S0067,S0067,S0067_EKDL210010479-1a-AK890-7UDI280_HV7M7DSX2_L4_1.fastq,S0067_EKDL210010479-1a-AK890-7UDI280_HV7M7DSX2_L4_2.fastq
S0068,S0068,S0068_EKDL210010479-1a-GD06-AK845_HV7M7DSX2_L4_1.fastq,S0068_EKDL210010479-1a-GD06-AK845_HV7M7DSX2_L4_2.fastq
S0069,S0069,S0069_EKDL210010479-1a-GG04-AK705_HV7M7DSX2_L4_1.fastq,S0069_EKDL210010479-1a-GG04-AK705_HV7M7DSX2_L4_2.fastq
S0070,S0070,S0070_EKDL210010479-1a-7UDI300-7UDI206_HV7M7DSX2_L4_1.fastq,S0070_EKDL210010479-1a-7UDI300-7UDI206_HV7M7DSX2_L4_2.fastq
```

## Run Command

Save log in some place for deletion, and add resume to espace steps has done.

```bash
nextflow -log ./log/debugLog run main.nf -resume
```

## echo Hello World

The `echo true` is vital here, along with the echo command indeed used in below script... don't know if println works.

```bash
process "Hello World" {
   echo true

   """
   echo [Debug Output] Hello World!
   """
}
```

The output is:

```
N E X T F L O W  ~  version 21.10.6
Launching `main.nf` [pensive_monod] - revision: 6a534f2851
executor >  local (5)
[a3/379ccf] process > Hello World        [100%] 1 of 1, cached: 1 ✔
[25/5d4071] process > fastp_trimming (3) [100%] 5 of 5 ✔
[Debug Output] Hello World!
```

## tuple Action

tuple seems like a array of string, similar to `c()` function in R. Until now I found two ways to use it. In ths first code, map is used only to create tuple without any key. And in the process, `val oneFQ` is used to fetch each tuple. Then `oneFQ[0], oneFQ[1]...` can be used in script.

```bash
#!/usr/bin/env nextflow

params.fqDIR = "../S01_SubsetFQ/subFQ/"
params.SampleSheet = '../S01_SubsetFQ/SampleSheet.csv'

samples_ch = Channel.fromPath(params.SampleSheet)
  .splitCsv(header: true)
  .map{ row -> tuple(row.Barcode, row.end_1, row.end_2) }

process 'test_tuple' {

    echo true
    input:
        val oneFQ from samples_ch
    output:

    script:
        """
        echo ${params.fqDIR}${oneFQ[1]}
        echo ${params.fqDIR}${oneFQ[1]} > file
        """
}
```

In below second piece of code, I can give each value a name when I fetch them from a channel (in input part). Then the new name can be used in following script...

```bash
... // save as above

process 'test_tuple' {
    echo true
    input:
        tuple sampleName, end1, end2 from samples_ch
    output:

    script:
        """
        echo ${sampleName}
        echo ${params.fqDIR}${end1} > file
        """
}
```

Well...I personally don't like to create too many names. Here `sampleName`, `end1`, `end2` are created ONLY based on order of channel group. To me it's a very much not obvious declaration of a new variable name...