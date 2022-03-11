---
slug: '/notes/Write-a-Docker-for-Nextflow-Process'
date: '2022-03-10'
title: 'Write a Docker for Nextflow Process'
tags: ['docker', 'nextflow']
abstract: 'I am working on a nextflow pipeline recently, which contains a couple of process in the pipeline. We want to use docker to run each process, so here I am writing my coding report of how to create a docker for process, run it, and collect results .etc'
---

I my [another post](https://yuantian1991.github.io/notes/My-Nextflow-Patterns), I am working on nextflow pipeline recently. Now I want to create a docker for one process. Merely I don't expect too fancy things for this docker. It must be able to set up, integrated with nextflow, run corresponding command, return results. Also, I need to learn how to "dig into" docker images when it's running, otherwise I can't debug. I found some useful post like [this](https://www.nextflow.io/blog/2016/docker-and-nextflow.html).

## Create a Dockerfile

In my currently folder, I created a folder called `nf-docker`, which is used to host a various of docker to be used in a nextflow. In other word, each docker corresponding to one process in nextflow. Firstly I created a folder called `docker_fastp`, it will be used to run fastp trimming. In the folder, create a file called `Dockerfile`:

```docker
# Download base image ubuntu 20.04
FROM ubuntu:20.04

# Install wget
RUN  apt-get update \
  && apt-get install -y wget \
  && rm -rf /var/lib/apt/lists/*

# Install fastp in this docker
RUN wget http://opengene.org/fastp/fastp -P usr/local/bin/ \
    && chmod a+x  usr/local/bin/fastp
```

Very simple, just 3 lines, the first one use Ubuntu 20.04, the second one install wget (incredable that it's not default exist...). The third command install fastp.

## Build

After writing, secondly we can build it, like this:

```bash
docker build -t nf_fastp ./nf-docker/docker_fastp
```

This builds the image from the Dockerfile and assigns a tag (i.e. a name) for the image. If there are no errors, the Docker image is now in you local Docker repository ready for use. However, I prefer to have a way to find the location of this image.

Below command can help to locate the build image. However, I checked it does not have much easy-readable information. Apparently Docker will "compile" the image in some special way.

```bash
docker image inspect nf_fastp
[
    {
        ...
        "GraphDriver": {
            "Data": {
                "LowerDir": "/var/lib/docker/overlay2/7ec1a64b74bd7a56c4eeda28d38fc6eafd961aa5488d9c2c44a03be3efa70d7e/diff:/var/lib/docker/overlay2/2c4563a37e98864064ed310cd880edd4696df38722df14ddafe21fc694324bf6/diff",
                "MergedDir": "/var/lib/docker/overlay2/dd60d80847d946fed80bbd238de8c4e9bc110f92a15c69ec3998dace1a5f7a10/merged",
                "UpperDir": "/var/lib/docker/overlay2/dd60d80847d946fed80bbd238de8c4e9bc110f92a15c69ec3998dace1a5f7a10/diff",
                "WorkDir": "/var/lib/docker/overlay2/dd60d80847d946fed80bbd238de8c4e9bc110f92a15c69ec3998dace1a5f7a10/work"
            },
            "Name": "overlay2"
        }
        ...
    }
]
```

Another way is to type below command, it should appear on top.

```bash
docker image ls # or: docker images
REPOSITORY      TAG         IMAGE ID        CREATED             SIZE
nf_fastp        latest      7bba73a1712a    41 minutes ago      91.3MB
```

## Run (Debug)

After building, below command can be used to check the internal env of docker when it's running:

```bash
docker run -it nf_fastp
```
The `-it` parameter means `-interactive --tty`. Above command enter a terminal (root), and I know I am in the environment created by docer, with my nf_fastp image. By type `fastp -v`, I know it has been installed correctly. Durning the above command running, don't clost it, then reopen a terminal, below command shows docker now have a container running:

```bash
docker container ls
CONTAINER ID   IMAGE      COMMAND       CREATED          STATUS          PORTS     NAMES
8ebbc21da2dd   nf_fastp   "bash"        15 seconds ago   Up 14 seconds             nifty_thompson
```

This is a very good way to debug. If I just run `docker run nf_fastp`, it will finish quite quick without any message. I guess it's because there is command assigned for the image.

> I normally use below command to directly start the docker, not sure if it's a good way...
> ```
> docker build -t nf_fastp ./nf-docker/docker_fastp && docker run -it nf_fastp
> ```

## Name

In the run command, we can set `--name my_nf_fastp` to give the docker container a name. If we don't, a random one will be generated. However, we can't create container with same name, so everytime you run, the old one need to be removed as:

```bahs
docker rm my_nf_fastp
```

## ENV, WORKDIR and ENTRYPOINT

These two thigs are not must needed, but nice to have. The WORKDIR define a folder (create one if not exist) where all Run or CMD will be running. And ENV could be used to define env variable, for example path to software installed.

In below example, WORKDIR is `/app`, all software will be installed in the `software` folder in this folder. Then the `ENV PATH "$PATH:/app/software"` is needed to export path for global usage.

In terms of running, since ENTRYPOINT is defined as fastp, it can be run as **docker run nf_fastp**, in this case ENTRYPOINT will be automatically running, and join CMD.

```docker
# Download base image ubuntu 20.04
FROM ubuntu:20.04

WORKDIR /app

ENV PATH "$PATH:/app/software"

RUN  apt-get update \
  && apt-get install -y wget \
  && rm -rf /var/lib/apt/lists/*

# Install fastp in this docker
RUN wget http://opengene.org/fastp/fastp -P software/ \
    && chmod a+x  software/fastp

ENTRYPOINT ["fastp"]
CMD ["--help"]
```

There are some other ways to trigger action. For example, CMD is not even needed. If I remove the last two lines above, the command could be:

```bash
docker run nf_fastp fastp --help
```

The `docker run container` + `shell command` solution is prefered by me.

## Files exchange between hostmachine and container &bigstar

So now I get a image with installed software, then I need to get data in it for running. Initially I thought I need `COPY` command here in docker, but after a while COPY is properly used for image building, which means it is something should be copied as a part of the docker functionality. For example, a frontend/backend of a website, a script have been written (but not argument) to be passed into it.

The solution is `-volumn`. Like below:

```bash
docker run -it -v /scratch1/Tian/Cansor/Nextflow/S03_MyNextFlow/to-be-copied:/app/data nf_fastp wc -l ./data/SampleSheet.csv
```

* The **-v /scratch1/Tian/Cansor/Nextflow/S03_MyNextFlow/to-be-copied:/app/data** part is mounting the hostmachine directory to docker-image /app/data. **It MUST be absolute path here.**
* The **wc -l ./data/SampleSheet.csv** part is a command to run inside the container.

Similarly, we can directly export the calcualted result from docker in the `/data`.

```bash
docker run -it -v /scratch1/Tian/Cansor/Nextflow/S03_MyNextFlow/to-be-copied:/app/data nf_fastp touch ./data/whatever.txt
```
The `touch ./data/whatever.txt` will driectly exported to host machine.

> &bigstar; Note that commands like `echo 'Hello World' > ./data/helloworld.txt` can't be assigned after docker run. I did not dig too deep. but it looks like `>` will be seens as hostmachine. In this case, after long time google, the solution is to pass the whole command in docker like below.

```bash
docker build -t nf_fastp ./nf-docker/docker_fastp && docker run --rm  -v /scratch1/Tian/Cansor/Nextflow/S03_MyNextFlow/syncFolder:/app/data nf_fastp bash -c "echo 'Hello World' > ./data/helloworld.txt"
```

## Docker summary

Until now, I think above are most Essential Knowledge for Docker, I can use docker eventually like a command line:
1. Wrap all software, installing, setting, path .etc, even middle results in the container.
2. Pass files, or values as parameter to execue.
3. Finally received results in host machine.

I think, in theory most bioinformatic analysis can be wraped into a docker like this. **The fundermental principle here is that it simplised the software installation step**.

---

## Integration Nextflow with Docker

Now I have leanred [nextflow](https://yuantian1991.github.io/notes/My-Nextflow-Patterns), and docker. The next task is to integrate them. My purpose is to write each docker for each process. So call "componentization", or "modularization". So that in the future, I can "form" or "assembly" nextflow pipeline quickly with these components. This is possibly a bad idea, as Bioinformatics softwares have ton's of parameters, it's may not work to have just a container to run everydata...

