#!/bin/bash
# A bash script help me to easily create folder/file/initialMessage for my personal website

echo "Note title is：$1";

title=$1
currentDate=$(date '+%Y-%m-%d')

filename="${title// /-}"
foldername="$currentDate-$filename"

echo "Folder name is: $foldername"
echo "File name is: $filename"

echo "Create folder"
mkdir "./contents/notes/$foldername"

file="./contents/notes/$foldername/index.md"

echo "Create index.md file"
touch $file

echo "Add title text in it"
echo "---
slug: '/notes/$filename'
date: '$currentDate'
title: '$title'
tags: []
abstract: ''
---
" >>  $file

