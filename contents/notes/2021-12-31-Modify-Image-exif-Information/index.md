---
slug: '/notes/Modify-Image-exif-Information'
date: '2021-12-31'
title: 'Modify Image exif Information'
tags: ['R']
abstract: 'In the last day of 2021, I made a website for my lovely doggy Mountain. However, when I am organising his two-year ranges photos, I noticed all images from my camera time are all wrong. So I tried to solve it a bit, re-annotated image timestamp.'
---

In the last day of 2021, a year seems many thing happened to me but seem nothing accomplished eventually, I made a website for my lovely doggy Mountain. When I am organising the photos from mobile phone and camera, I noticed all photoes from my camera have a wrong time stamp. For example, I just quickly took a photo last night, and it shows the modified time is 22 October 2019 at 11:34, roughtly 2 years ago.

So, I need to find way to: Fistly read all image's `mtime`, which exist in image's [exif](https://en.wikipedia.org/wiki/Exif) meta information. Then, re-calculate the correct time, the idea is use the last photo I took as a comparison. Third, find a way to "modify" the timestamp for each image ago. And since I am good at R, I am thinking if I can find a R solution for it.

## 1. Read Exif information from Image

Firstly I found I can use pacakge exiftoolr to read exif information from images. After installation, the package need to be loaded like:

```R
library(exiftoolr)
install_exiftool()
```

Then the information can be extracted as: 

```R
images <- dir("./Cannon/", full.names=TRUE)

dat <- exif_read(images)
timeStamp <- dat$CreateDate
```

## 2. Convert between date and unix time

Then I need to convert the date back to unix time, add up the "missing time gap". The way to convert date to unix time is:

```R
dates <- unname(sapply(timeStamp, function(x) strsplit(x, split=" ")[[1]][1]))
times <- unname(sapply(timeStamp, function(x) strsplit(x, split=" ")[[1]][2]))

dates <- gsub(":", "-", dates)

uTime <- as.numeric(as.POSIXct(paste(dates, times)))
gap <- 1640912569 - max(uTime)
```

The `gap` is the time for the last image I took last night, so I know the exact date and time, which is the unix time 1640912569, since the timestamp for the origin photo is 2019-10-something. I can calculate the gap between real time and the delay of my camera. Finally, convert the unix time back to date:

```R
library("lubridate")
newDate <- as_datetime(uTime + gap)
newDate <- substr(newDate, 1, 19)
```

## 3. Modify exif information

Finally, I find a way to modify the JPG information. The solution is `exiftool`, thanks for this [post](https://stackoverflow.com/questions/53926085/how-to-change-media-created-date-in-exiftool). I use linux software to do it, by use R to execute linux command.

```R
library("glue")
for(i in 1:length(images)) {
    cmd <- glue("exiftool \"-CreateDate={newDate[i]}\" -overwrite_original {images[i]}")
    message(cmd)
    system(cmd)
}

```