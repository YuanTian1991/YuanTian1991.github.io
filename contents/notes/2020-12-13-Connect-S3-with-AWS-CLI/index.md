---
slug: '/notes/Connect-S3-with-AWS-CLI'
date: '2020-12-13'
title: 'Connect S3 with AWS CLI'
tags: ['aws', 'S3']
abstract: 'Firs time doing things related to AWS. I never use anything related to AWS because I do not want to pay any money to it. Thanks for my friends, now I have a chance to get to know this famous cloud service provider.'
---

I am about to create a uploading tool, to upload files from user's browser to S3, which is so hard. I am using [uppy.js](https://uppy.io/), which from my point of view, does not have a good document to guild me through. However, now I want to connect to AWS S3, which is where our files eventually need to be transfered.

## Install AWS CLI

Firstly thing is to install [AWS CLI](https://aws.amazon.com/cli/). This is a tool that need to be installed on my local computer. So I choosed Mac version.

## Configure AWS CLI

Then AWS CLI need to be **configured**, in short, input your credential information, to tell AWS who you are and what access they should give you. Start the terminal, then type `aws configure`, it should work. I have only the ID and Secret Key provided by my friends, which is already enough, so I left the rest two empty.

```bash
> aws configure
AWS Access Key ID [None]: AAAAAAAAAAAAA
AWS Secret Access Key [None]: XXXXXXXXXXXXXXXXXXX
Default region name [None]:
Default output format [None]:
```

## Show all S3 Buckets

Now we can try connect the S3 bucket, below command would tell me what bucket we have, and I have access to:

```bash
aws s3 ls
```

## View one S3 Bucket

Then I can view one bucket as:

```bash
aws s3 ls s3://some-bucket-name
```
Then I can see something labelled `PRE` and something labelled time. So the `PRE` should means folder, and things labelled time should means files uploaded.

## Upload file to a S3 Bucket

I created a file in my current computer folder called `TestFile_Tian.txt`, trying to upload it to a bucket:

```bash
aws s3 cp TestFile_Tian.txt s3://some-bucket-name
```

It worked, so I can see this file on this bucket:

```bash
aws s3 ls s3://some-bucket-name
                           PRE vcf/
2020-12-13 00:03:00         21 TestFile_Tian.txt
```

I did not test how to upload a folder there.

## Delete file from a S3 Bucket

Finally, I want to try delete the file I just uploaded:

```bash
aws s3 rm s3://some-bucket-name/TestFile_Tian.txt
```
Then the file is deleted.

---

Here is just a simply record of my first experience with S3, (and AWS).