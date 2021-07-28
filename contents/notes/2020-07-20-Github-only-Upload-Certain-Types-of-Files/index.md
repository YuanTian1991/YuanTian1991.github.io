---
slug: '/notes/Github-only-Upload-Certain-Types-of-Files'
date: '2020-07-20'
title: 'Github only Upload Certain Types of Files'
tags: ['Github']
abstract: 'A short note about how to set up .gitignore'
---

After being addicted to Github, I now like to use to manage all my science work. So in short, I want to create each project a repo, then in the future all my scripts would be uploaded onto it. **The key thing here is, I can not upload data generated to github, as they are too big**. So I need to set .gitignore file to achieve this.

In my case, I just create a repo called `lungNet` in my github. Then in my project folder, use command:
```bash
git init
```

Then create a file called `.gitignore`, add content as below:
```git
# Ignore everything
*

# Exceptions
!.gitinore
!*/
!*.R
!*.r
!.xlsx
!.csv
```

It means this repo only consider files with extension like R/r/xslx/csv.

Then I can `git add .` it works well.

```bash
(base) regmtyu@SLMSICANBECK01:/Data/Tian/Postdoc/ChrisData/Updated$ git status
# On branch master
#
# Initial commit
#
# Changes to be committed:
#   (use "git rm --cached <file>..." to unstage)
#
#	new file:   BatchCorrection_9/Step9-Batch-Correction.R
#	new file:   BatchCorrection_9/batchExplore.R
#	new file:   DMPValidation_3/Step-3-DMP-Validation.R
#	new file:   Heatmap_2/Step2-Draw-Clustering-Plot.R
#	new file:   LoadingData_0/Step0-Data-Loading.R
#	new file:   ML_4/RunNC.R
#	new file:   ML_4/Scripts/DMP.R
#	new file:   ML_4/Scripts/Hallmarks_of_cancer_GSEA.R
#	new file:   ML_4/Scripts/ML_functions.r
#	new file:   ML_4/Scripts/myML_function.R
#	new file:   ML_4/Scripts/myML_function_Feature.R
#	new file:   ML_4/Step4-ML.R
#	new file:   MOFA_6/Scripts/integration_MOFA.R
#	new file:   MOFA_6/Step6-MOFA.R
#	new file:   Methylation_analysis_scripts
#	new file:   MitosisNecrosis_7/Step7-Mitosis-Necrosis-Plot.R
#	new file:   Preparation_1/Step1-Data-Preparation.R
#	new file:   Prepare_Cohort_10/Step10-Prepare-Cohort.R
#	new file:   QC_8/FormTable.R
#	new file:   QC_8/GetBeadCount.R
#	new file:   QC_8/Heiss/HeissQC.R
#	new file:   QC_8/Step8_QC.R
#	new file:   QC_8/locfdr.R
#	new file:   Survival_Curve_5/Step5-Survival.R
```


Below bash code could count numbers of each types of file.
```bash
find . -type f | sed -n 's/..*\.//p' | sort | uniq -c
```