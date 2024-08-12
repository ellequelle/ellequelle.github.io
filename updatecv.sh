#!/usr/bin/env bash

# exit on error
set -e

# path to the directory holding CV files
export CV_DIR=~/Documents/ledoc/cv-things

# beginning of CV filename
# CV filename is expected to end with a date formatted like YYYYMMDD
# example: leh-cv-20230922.docx
# both pdf and html files are expected
export CV_BASENAME=leh-cv-

# destination dir and filename
CV_DEST_NAME=files/cv/le_hanson-cv

# get script source dir
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# grep to get list of matching filenames
# reverse sort to get most recent date (largest number)
fnames=($( ls $CV_DIR/$CV_BASENAME*doc* | sort -r ))

# get first name in list
fname=${fnames[0]}
# split around '.' extension using translate
fname=($(echo $fname | tr '.' ' '))
# remove extension
fname=${fname[0]}

# make pdf and html filenames
pdfnames="$fname".pdf
htmlnames="$fname".html

# copy to destination dir
echo "cp $pdfnames $SCRIPT_DIR/$CV_DEST_NAME.pdf";
cp "$pdfnames" "$SCRIPT_DIR/$CV_DEST_NAME.pdf";
echo "cp $htmlnames $SCRIPT_DIR/$CV_DEST_NAME.html";
cp "$htmlnames" "$SCRIPT_DIR/$CV_DEST_NAME.html";

# give status
echo "UPDATED CV";

#
exit 0;
