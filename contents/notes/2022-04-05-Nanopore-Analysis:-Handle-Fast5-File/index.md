---
slug: '/notes/Nanopore-Analysis:-Handle-Fast5-File'
date: '2022-04-05'
title: 'Nanopore Analysis: Handle Fast5 File'
tags: ['nanopore', 'alignment']
abstract: 'Recently I am working on Nanopore data, firstly I am trying to set up the pipeline for 5hmC/5mC and SNP calling. In this post, I record my first exploration of fast5 data, which is the default output format for Nanpore machines.'
---

Fast5 data seems important, as it contains raw signals, and eventually I think we need it for methylation or hydroxy-methylation calling. But it’s better to firstly understand the structure of fas5 file a bit, before blindly running software on it.

According to [here](https://denbi-nanopore-training-course.readthedocs.io/en/latest/basecalling/inspect_h5.html). “The raw signals in Nanopore sequencing are stored in HDF5 format. HDF stands for “Hierarchical Data Format”, this is some data structure I had experience with when I was using Hadoop and Spark.

## Check Groups in fast5

It’s quite easy to install HDF5 tool according [here](https://zoomadmin.com/HowToInstall/UbuntuPackage/hdf5-tools). Below command could list the structure of fa fast5 file.

```bash
h5ls -r ./S01_subFast5/PAD69014_dc2ac203adf3e034d363fe1208fc805805ace1f5_0.fast5 | less
```

Looks like there are `Groups` in one fast5 file, and each group contains information like Analyses, Raw, channel_id .etc

```bash
/                        Group
/read_000cecd0-55f8-4392-bb24-91e0d4bf0d97 Group
/read_000cecd0-55f8-4392-bb24-91e0d4bf0d97/Analyses Group
/read_000cecd0-55f8-4392-bb24-91e0d4bf0d97/Analyses/Basecall_1D_000 Group
/read_000cecd0-55f8-4392-bb24-91e0d4bf0d97/Analyses/Basecall_1D_000/BaseCalled_template Group
/read_000cecd0-55f8-4392-bb24-91e0d4bf0d97/Analyses/Basecall_1D_000/BaseCalled_template/Fastq Dataset {SCALAR}
/read_000cecd0-55f8-4392-bb24-91e0d4bf0d97/Analyses/Basecall_1D_000/Summary Group
/read_000cecd0-55f8-4392-bb24-91e0d4bf0d97/Analyses/Basecall_1D_000/Summary/basecall_1d_template Group
/read_000cecd0-55f8-4392-bb24-91e0d4bf0d97/Analyses/Segmentation_000 Group
/read_000cecd0-55f8-4392-bb24-91e0d4bf0d97/Analyses/Segmentation_000/Summary Group
/read_000cecd0-55f8-4392-bb24-91e0d4bf0d97/Analyses/Segmentation_000/Summary/segmentation Group
/read_000cecd0-55f8-4392-bb24-91e0d4bf0d97/Raw Group
/read_000cecd0-55f8-4392-bb24-91e0d4bf0d97/Raw/Signal Dataset {19251/Inf}
/read_000cecd0-55f8-4392-bb24-91e0d4bf0d97/channel_id Group
/read_000cecd0-55f8-4392-bb24-91e0d4bf0d97/context_tags Group
/read_000cecd0-55f8-4392-bb24-91e0d4bf0d97/tracking_id Group
/read_000d5bae-8b68-44d6-8306-9565846de423 Group
/read_000d5bae-8b68-44d6-8306-9565846de423/Analyses Group
/read_000d5bae-8b68-44d6-8306-9565846de423/Analyses/Basecall_1D_000 Group
/read_000d5bae-8b68-44d6-8306-9565846de423/Analyses/Basecall_1D_000/BaseCalled_template Group
/read_000d5bae-8b68-44d6-8306-9565846de423/Analyses/Basecall_1D_000/BaseCalled_template/Fastq Dataset {SCALAR}
/read_000d5bae-8b68-44d6-8306-9565846de423/Analyses/Basecall_1D_000/Summary Group
/read_000d5bae-8b68-44d6-8306-9565846de423/Analyses/Basecall_1D_000/Summary/basecall_1d_template Group
/read_000d5bae-8b68-44d6-8306-9565846de423/Analyses/Segmentation_000 Group
/read_000d5bae-8b68-44d6-8306-9565846de423/Analyses/Segmentation_000/Summary Group
/read_000d5bae-8b68-44d6-8306-9565846de423/Analyses/Segmentation_000/Summary/segmentation Group
/read_000d5bae-8b68-44d6-8306-9565846de423/Raw Group
/read_000d5bae-8b68-44d6-8306-9565846de423/Raw/Signal Dataset {33739/Inf}
/read_000d5bae-8b68-44d6-8306-9565846de423/channel_id Group
/read_000d5bae-8b68-44d6-8306-9565846de423/context_tags Group, same as /read_000cecd0-55f8-4392-bb24-91e0d4bf0d97/context_tags
/read_000d5bae-8b68-44d6-8306-9565846de423/tracking_id Group, same as /read_000cecd0-55f8-4392-bb24-91e0d4bf0d97/tracking_id
/read_0012399f-1f0b-436a-a818-e93951a3032a Group
/read_0012399f-1f0b-436a-a818-e93951a3032a/Analyses Group
/read_0012399f-1f0b-436a-a818-e93951a3032a/Analyses/Basecall_1D_000 Group
/read_0012399f-1f0b-436a-a818-e93951a3032a/Analyses/Basecall_1D_000/BaseCalled_template Group
/read_0012399f-1f0b-436a-a818-e93951a3032a/Analyses/Basecall_1D_000/BaseCalled_template/Fastq Dataset {SCALAR}
/read_0012399f-1f0b-436a-a818-e93951a3032a/Analyses/Basecall_1D_000/Summary Group
/read_0012399f-1f0b-436a-a818-e93951a3032a/Analyses/Basecall_1D_000/Summary/basecall_1d_template Group
/read_0012399f-1f0b-436a-a818-e93951a3032a/Analyses/Segmentation_000 Group
/read_0012399f-1f0b-436a-a818-e93951a3032a/Analyses/Segmentation_000/Summary Group
/read_0012399f-1f0b-436a-a818-e93951a3032a/Analyses/Segmentation_000/Summary/segmentation Group
/read_0012399f-1f0b-436a-a818-e93951a3032a/Raw Group
/read_0012399f-1f0b-436a-a818-e93951a3032a/Raw/Signal Dataset {10812/Inf}
/read_0012399f-1f0b-436a-a818-e93951a3032a/channel_id Group
/read_0012399f-1f0b-436a-a818-e93951a3032a/context_tags Group, same as /read_000cecd0-55f8-4392-bb24-91e0d4bf0d97/context_tags
/read_0012399f-1f0b-436a-a818-e93951a3032a/tracking_id Group, same as /read_000cecd0-55f8-4392-bb24-91e0d4bf0d97/tracking_id
/read_001b0e65-8d52-44df-a9ee-28778ec718f9 Group
/read_001b0e65-8d52-44df-a9ee-28778ec718f9/Analyses Group
/read_001b0e65-8d52-44df-a9ee-28778ec718f9/Analyses/Basecall_1D_000 Group
```

## View All Reads

Below command would list all reads contains in this fast5. In theory, I guess later these read number would be appear in converted fastq file.

```
h5ls ./S01_subFast5/PAD69014_dc2ac203adf3e034d363fe1208fc805805ace1f5_0.fast5 | less
read_000cecd0-55f8-4392-bb24-91e0d4bf0d97 Group
read_000d5bae-8b68-44d6-8306-9565846de423 Group
read_0012399f-1f0b-436a-a818-e93951a3032a Group
read_001b0e65-8d52-44df-a9ee-28778ec718f9 Group
read_001ce58b-5105-4e04-894a-80bb521487b9 Group
read_00335fb1-408d-4c4f-b639-fcd149d055ff Group
read_004c85e0-cae5-447f-9d2c-3b049653e998 Group
read_004de239-d2a8-4788-abe8-0ec03d35e90b Group
read_004f65c6-9be1-44c5-a2de-07ce21aee666 Group
read_007fc14d-96a0-4536-83ac-5f0af0629d21 Group

```

To check totally how many reads, we can do:

```bash
h5ls ./S01_subFast5/* | wc -l
```

## View one Reads’ Signal

By using below command, we can have a look at more detail structure of each group like:

```bash
h5dump -g "/read_000cecd0-55f8-4392-bb24-91e0d4bf0d97/Raw" ./S01_subFast5/PAD69014_dc2ac203adf3e034d363fe1208fc805805ace1f5_0.fast5 | less

HDF5 "./S01_subFast5/PAD69014_dc2ac203adf3e034d363fe1208fc805805ace1f5_0.fast5" {
GROUP "/read_000cecd0-55f8-4392-bb24-91e0d4bf0d97/Raw" {
   ATTRIBUTE "duration" {
      DATATYPE  H5T_STD_U32LE
      DATASPACE  SCALAR
      DATA {
      (0): 19251
      }
   }
   ATTRIBUTE "median_before" {
      DATATYPE  H5T_IEEE_F64LE
      DATASPACE  SCALAR
      DATA {
      (0): 178.09
      }
   }
   ATTRIBUTE "read_id" {
      DATATYPE  H5T_STRING {
         STRSIZE 37;
         STRPAD H5T_STR_NULLTERM;
         CSET H5T_CSET_ASCII;
         CTYPE H5T_C_S1;
      }
      DATASPACE  SCALAR
      DATA {
      (0): "000cecd0-55f8-4392-bb24-91e0d4bf0d97"
      }
   }
   ATTRIBUTE "read_number" {
      DATATYPE  H5T_STD_I32LE
      DATASPACE  SCALAR
      DATA {
      (0): 90
      }
   }
   ATTRIBUTE "start_mux" {
      DATATYPE  H5T_STD_U8LE
      DATASPACE  SCALAR
      DATA {
      (0): 4
      }
   }
   ATTRIBUTE "start_time" {
      DATATYPE  H5T_STD_U64LE
      DATASPACE  SCALAR
      DATA {
      (0): 423002
      }
   }
DATASET "Signal" {
      DATATYPE  H5T_STD_I16LE
      DATASPACE  SIMPLE { ( 19251 ) / ( H5S_UNLIMITED ) }
      DATA {
      (0): 475, 426, 416, 415, 418, 418, 421, 410, 412, 415, 419, 417, 427,
      (13): 425, 431, 427, 424, 419, 415, 415, 418, 406, 411, 418, 406, 395,
      (26): 392, 396, 389, 393, 397, 404, 407, 406, 402, 395, 411, 416, 409,
      (39): 405, 398, 402, 402, 406, 406, 407, 391, 391, 404, 406, 399, 402,
      (52): 400, 404, 405, 407, 403, 402, 405, 406, 399, 411, 414, 405, 407,
      (65): 399, 403, 398, 411, 411, 410, 399, 401, 399, 406, 411, 402, 415,
      (78): 398, 399, 402, 411, 400, 412, 408, 401, 404, 409, 399, 408, 410,
      (91): 406, 409, 399, 411, 407, 407, 412, 409, 403, 404, 409, 407, 408,
      (104): 409, 401, 411, 411, 399, 403, 405, 407, 410, 399, 409, 402, 407,
      (117): 416, 407, 414, 412, 405, 409, 405, 410, 409, 412, 401, 412, 410,
      (130): 411, 414, 402, 407, 407, 411, 407, 398, 408, 405, 407, 408, 411,
      (143): 412, 414, 403, 410, 404, 399, 408, 411, 408, 411, 406, 407, 401,
      (156): 406, 410, 410, 411, 403, 410, 405, 412, 406, 407, 408, 405, 408,
      (169): 411, 407, 403, 405, 402, 413, 410, 409, 412, 407, 403, 404, 413,
      (182): 419, 410, 397, 405, 411, 411, 405, 406, 402, 408, 415, 416, 415,
      (195): 396, 411, 412, 407, 410, 408, 401, 406, 405, 410, 417, 408, 398,
      (208): 411, 409, 401, 411, 409, 412, 403, 407, 407, 409, 412, 410, 411,
      (221): 411, 401, 402, 405, 412, 407, 401, 410, 413, 408, 409, 407, 392,
      (234): 409, 405, 400, 405, 415, 408, 400, 405, 409, 415, 410, 399, 406,
      (247): 399, 412, 414, 401, 411, 412, 406, 413, 400, 403, 408, 410, 396,
      (260): 409, 409, 414, 412, 401, 400, 406, 413, 413, 406, 401, 411, 414,
      (273): 402, 408, 401, 406, 413, 407, 406, 397, 406, 409, 405, 406, 403,
...
```

So this is one of the raw data group, or can be seen as a “folder”. It shows that `000cecd0-55f8-4392-bb24-91e0d4bf0d97` is a ”read_id”.

Another solution to check raw signal is here:

```bash
h5ls -d ./S01_subFast5/PAD69014_dc2ac203adf3e034d363fe1208fc805805ace1f5_0.fast5/read_000cecd0-55f8-4392-bb24-91e0d4bf0d97/Raw
```

According to [this post](https://medium.com/@shiansu/a-look-at-the-nanopore-fast5-format-f711999e2ff6#id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImNlYzEzZGViZjRiOTY0Nzk2ODM3MzYyMDUwODI0NjZjMTQ3OTdiZDAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2NDkwODY4NTUsImF1ZCI6IjIxNjI5NjAzNTgzNC1rMWs2cWUwNjBzMnRwMmEyamFtNGxqZGNtczAwc3R0Zy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExMTQ4NDQ1NjUyMzUzNDk0MjE3MSIsImVtYWlsIjoidGlhbnl1YW4xOTkxaGl0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhenAiOiIyMTYyOTYwMzU4MzQtazFrNnFlMDYwczJ0cDJhMmphbTRsamRjbXMwMHN0dGcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJuYW1lIjoiWXVhbiBUaWFuIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdoeGpyVTNRWHYyXzFNc0xySkNnZkZRY2xLTFYtS2VrM2w5TWVyVl9RPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Ill1YW4iLCJmYW1pbHlfbmFtZSI6IlRpYW4iLCJpYXQiOjE2NDkwODcxNTUsImV4cCI6MTY0OTA5MDc1NSwianRpIjoiZjg5MjViMmI3NTg5YjJmNzMyNmRlZWFiYTdkZTM0OWFiNzc3Y2JjOCJ9.T07BQUI6DNC7egXsbk880IfYHUn2_pF4iyXpCPlBrMuo8VBPjZqcxONB1lzWhAgLf8cgvuaRCvSsVJvH0yfMeAK_phcYXgNOgvWi6r20zv2YmQ0lIvlLll8mKP2fxvpO_OS1l_WQGFOy0EvJ31Ma9VyVhlsGw2VWHzLRKYMYpj8aZW8j3hBQAa0nW_eNr4cOC0C9sdGZos0ShmhjSBCItryrSs3_VlIGVQAvmKu2-JnpyOtsfVQuxInr1gmGC4wF-1mN_suIwJ4Zho452ThcoCEAGhkroGpQZ-kplpN6VUhhjARjOMpmcA3TkzycRrG5xCR1NY95WGieOIaRbxRZVQ) author, he discovered the equation for raw pA calculation is [here](https://github.com/nanoporetech/ont_fast5_api/blob/4d5691645ce2d5e326f6dfa7ef28bc4c3b9bc903/ont_fast5_api/fast5_file.py#L691). 

“The signals are orignally measured as pA (picoamps) values and stored as 16-bit integer values. To transform back into the original pA values requires offset and scaling, I discovered the transformation in the source code of ONT’s fast5 API:

`pA_val` = `scale` * (`raw` + `offset`)

Where raw is the 16-bit values stored inside Raw/Read_####/Signal and scale is calculated as range/digitisation. range, digitisation and offset can be found in the Attributes of `/channel_id.`”, which can be checked via:

```bash
h5dump -A -g "/read_000cecd0-55f8-4392-bb24-91e0d4bf0d97/channel_id" ./S01_subFast5/PAD69014_dc2ac203adf3e034d363fe1208fc805805ace1f5_0.fast5 | less
```

## Summary

Above is really amazing detail work, I guess I don’t need to touch base to this level deep, but it’s still a good idea later to **compared the reads_ID, signal intensity and BaseCalled fastq** file a bit.

Another important thing is that seems methylation signal MUST be driven from fast5 file. So does it means I can’t ask Nanopore Machine to directly export fastq format file? In other word, the vital signal for methylation and 5hmC is hidden exactly in these signals. **It’s vital to know how exactly they match**.