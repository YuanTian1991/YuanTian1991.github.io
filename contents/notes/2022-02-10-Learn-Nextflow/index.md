---
slug: '/notes/Learn-Nextflow:-Part-1'
date: '2022-02-10'
title: 'Learn Nextflow: Part 1'
tags: ["nextflow"]
abstract: 'Recently I need to code a nextflow for RRBS analysis, so I learned nextflow a bit. Here is my record, it contains some most important and essential knowledge and understanding from me for this pipeline tool.'
---


For a long time I thought nextflow a tool to "link" various bash tools. One important feature for nextflow is that it can `-resume` pipeline, so that if I modified part of the script, not whole pipeline need to be rerun.

## 1. Groovy Programming Language

Firstly nextflow do use [a specific progamming language called "Groovy"](https://www.nextflow.io/docs/latest/script.html#). I don't why it's not directly using shell as default languages...No wonder some command in the tutorial script looks weird.

Mostly Groovy is just like other quick programming language, can print, if else, for loop .etc.

### 1.1. Printing

Double-quoted strings support variable interpolations, while single-quoted strings do not. sIn below two syntax, only the second one print "Hello World", the first one print out "$x"

```groovy
x = 'Hello World'
println '$x'
println "$x"
```

This is mostly likely going to be use for log output in each process.

### 1.2. Reserved Variables

There are some reserved variables name, like `baseDir`, `task` .etc. It's easy to understand, just like you can't define a variable as "break" in most language. `task` seems is a parameter can be access at each process.

```groovy
process foo {
  script:
  """
  some_tool --cpus $task.cpus --mem $task.memory
  """
}
```

### 1.3. Function declaration

A crazy way to define function. Below style closure function only allow one parameter, `it` is a reserved parameter, which represent the only one parameter you inputed into the function.

```groovy
square = { it * it }
println square(9)
```

Two quick way to "apply" function on each element in a array. The first method run each parameter one bye one. The second one also run them one by one, **but then collect the results into a array**.

```groovy
[ "Yue" : "Wu", "Mark" : "Williams", "Sudha" : "Kumari" ].each(printMapClosure)
[ 1, 2, 3, 4 ].collect(square)
```

Below synatax smilar to javascript anonymous function declaration...
```groovy
myMap.keySet().each( { result+= myMap[it] } )
```

### 1.4. Files and I/O

This is possibly the most useful feature, but most Bioinformatic just require file path to run...So again not sure what it can be used. Seems we can use it to read ile, move file, delete file .etc.

I have feeling that groovy is a bad design here, it confuse people between groovy and bash. Sometime we can use `cat` or `echo` in bash, sometimes we need to use `println`, closure function in groovy.

## 2. Process

The process definition starts with keyword the process, followed by process name and finally the process body delimited by curly brackets. The process body **must** contain a string which represents the command or, more generally, a script that is executed by it. A basic process looks like the following example:

```bash
process <name> {
   [directives]
   input:
    <process inputs>

   output:
    <process outputs>

   when:
    <condition>

   [script|shell|exec]:
   <user script to be executed> # This part is required.
}
```

### 2.1. Script

The most important part is the **script|shell|exec**. The default is `script`.

Note that, in script bash command, `""` or `"""` does support variable interpretation, but `''` or `'''` does not. The nextflow (groovy) variable is vital here, which is normally defined as `$something`, and only `""` can intepret them. However, if want bash to get system variable (not nextflow), like `$PATH`, it requires `''`. In other word, both have the same synatax style `$something`, but require different code line.

Another solution for above problem is:

```bash
process myTask {
    input:
    val str from 'Hello', 'Hola', 'Bonjour'

    shell:
    '''
    echo User $USER says !{str}
    '''
}
```

Basically there is no difference between shell and script, but the first can mix-used two variables.

If I don't want to write raw shell command, but a shell script, I can be below way. Well...in other word, this so call `template` is a reserved name, and the functionality is similar to `./my_script.sh`?
```bash
process template_example {
    input:
    val STR from 'this', 'that'

    script:
    template 'my_script.sh'
}
```

#### 2.1.1.  Scripts à la carte (按菜单点菜) &bigstar;&bigstar;

This part is important here. **It seems in nextflow process, I can directly run other program's synatax. Like R or Python, without write a R script then use Rscript**. The vital thing is to write a line like `#!/usr/bin/r` on the top of script part in the process block.

```bash
process perlStuff {
    """
    #!/usr/bin/perl

    print 'Hi there!' . '\n';
    """
}

process pyStuff {
    """
    #!/usr/bin/python

    x = 'Hello'
    y = 'world!'
    print "%s - %s" % (x,y)
    """
}
```
Honestly, this is the third way I know how to run R, apart from in R interactive session and Rscript.

#### 2.1.2. Conditional scripts &bigstar;

Well, it looks like a if-else provided to run different script fragments. If nextflow does not provided, it's also not hard to write it in R or Python right? Note that it use `else if` not `if else` like most language.

```bash
seq_to_align = ...
mode = 'tcoffee'

process align {
    input:
    file seq_to_aln from sequences

    script:
    if( mode == 'tcoffee' )
        """
        t_coffee -in $seq_to_aln > out_file
        """
    else if( mode == 'mafft' )
        """
        mafft --anysymbol --parttree --quiet $seq_to_aln > out_file
        """
    else if( mode == 'clustalo' )
        """
        clustalo -i $seq_to_aln -o out_file
        """
    else
        error "Invalid alignment mode: ${mode}"
}
```

#### 2.1.3. Summary

In summary, script is used to run command in each process block. There are a couple of similar ways to run it. But as beginner a easy solution is to always use bash and Rscript .etc. All so call features like "Conditional" are replacable in your script, in one way or another. So I don't like to mixing use various styles. Use bash if a good start I think.

### 2.2. Input

[This](https://www.nextflow.io/docs/latest/process.html#inputs) is one vital part for nextflow, along with output I think.

#### 2.2.1. val (most commonly used type)

A "standard style" of input is like this. There is a shorter version as just `val num` but I don't suggest people use that version. In short, a val (reserved word) is used to "define" inputted variable. Apart from val, [there are other potential](https://www.nextflow.io/docs/latest/process.html#inputs) types like: env, file, path, stdin, tuple and each. They are different, so when I code the nextflow config, it's vital to select proper input.

```bash
num = Channel.from( 1, 2, 3 )

process basicExample {
  input:
  val x from num

  "echo process job $x"

}
```

Important thing is, I should write all files used in nextflow pipeline as parameter variable, never use "absolute path" in nextflow code. It provide higher flexibility to replace those files.

The thing I am not sure is, what's the difference between val and file here? If I just need a file path to run, why I can't use directory as variable.

#### 2.2.2. path for files

A better recommanded variable type for files is `path`, not file. Like below, the stageAs can be given as name of the file. So for example if my sample names are J080001.fa.gz, J080002.fa.gz .etc. I can use stageAs to name them as "RawFastq.fa.gz" in nextflow pipline.

```bash
process foo {
  input:
    path x, stageAs: 'data.txt' from '/some/data/file.txt'
  """
    your_command --in data.txt
  """
}
```

#### 2.2.3. each is useful in combination of parameters

Many variables are useless, like env, stdin. But `each` is important, it looks like below. It can read array, then repeatly run each option with files.

```bash
sequences = Channel.fromPath('*.fa')
methods = ['regular', 'expresso']
libraries = [ file('PQ001.lib'), file('PQ002.lib'), file('PQ003.lib') ]

process alignSequences {
  input:
  file seq from sequences
  each mode from methods
  each file(lib) from libraries

  """
  t_coffee -in $seq -mode $mode -lib $lib > result
  """
}
```
**When multiple repeaters are declared, the process is executed for each combination of them.**

Be careful that if there are two Chanels, they MUST have matched number of variable.

#### 2.2.4. Summary

Input is not too complicate. Mostly is from Channel. Note that `path` is prefered for file input, and stageAs can be used to give file another name for now in nextflow. Each is very useful for parameter repeat run.

### 2.3 Output

#### 2.3.1. File output &bigstar;&bigstar;&bigstar;

Below is an important example how to export files. It looks like file 'result.txt' will be automatically passed to channel numbers after the echo script command. I am thinking if I use a complex fastp command would it work? I suspect it work, but I must make sure one command only export one file. So... what if one process produce multiple output?

```bash
process randomNum {
   output:
   file 'result.txt' into numbers
   '''
   echo $RANDOM > result.txt
   '''
}

numbers.subscribe { println "Received: " + it.text }
```
Chnanel will be automatically created in the output line if they don't exist yet.

#### 2.3.2. FlatMap and Subscribe

In below example, `chunk_` files are automatically created, and they are passed to channel letters. Then letters can use functions like flatMap() and subscribe show results. That step converted letters from list to 

```bash
process splitLetters {

    output:
    file 'chunk_*' into letters

    '''
    printf 'Hola' | split -b 1 - chunk_
    '''
}c

letters.flatMap().subscribe { println "File: ${it.name} => ${it.text}" }
```

#### 2.3.3. Path and Conditional Output

I did not found example for Path...

Below is an example of output txt. I think it's very important. For example, if I write a R script, it will return TRUE for success run, and FALSE for failed run, how could nextflow know this process if correct and continue? An solution is the R result only write out a file when the calculation is TRUE, then use conditional output to send it to channel.

```bash
output:
    file("output.txt") optional true into outChannel
```

### 2.4. When

As I suspected, nextflow must have some way to chooce to "continue" the pipeline or not. One solution is above conditional output. And the other is below, use `When` to do it, the idea is also as I expected, by checking output file name to decide to continue or not.

```bash
process find {
  input:
  file proteins
  val type from dbtype

  when:
  proteins.name =~ /^BB11.*/ && type == 'nr'

  script:
  """
  blastp -query $proteins -db nr
  """

}
```

### 2.5. Directives
Using the directive declarations block you can provide optional settings that will affect the execution of the current process.

These are some additional parameter canbe set in nextflow. Some are useful, like `beforeScript`, it can be used to setup some env:

```bash
process foo {
  beforeScript 'source /cluster/bin/setup'
  """
  echo bar
  """
}
```

`Conda`, it is used to define your software and version. Where is the similar thing for R script?

```bash
process foo {
  conda 'bwa=0.7.15'

  '''
  your_command --here
  '''
}
```

`container` is used to define a docker container I want to use. I suspect I should use things like Ubuntu, or image-fastq here?
```
process runThisInDocker {

  container 'dockerbox:tag'

  """
  <your holy script here>
  """

}
```

`CpGs` can be set here. Ther prupose of setting is to protect other programes runnning on the computer. Otherwise it looks like nextflow will use up all resources.

```
process big_job {

  cpus 8
  executor 'sge'

  """
  blastp -query input_sequence -num_threads ${task.cpus}
  """
}
```

`errorStrategy` &bigstar; &bigstar; is used to retry process, and maxErrors can be set to make sure it work. **This is an important feature for Amazon Spot I think.**

```bash
process retryIfFail {
  errorStrategy 'retry'
  maxErrors 5

  """
  echo 'do this as that .. '
  """
}
```

`maxForks` &bigstar; &bigstar; is use to define number of parallel thread one process can have.

```bash
process doNotParallelizeIt {
   maxForks 1
   '''
   <your script here>
   '''
}
```

`publishDir` &bigstar; &bigstar; is used to export results. This is especially useful for output final results into a folder.

```bash
process foo {

    publishDir '/data/chunks'

    output:
    file 'chunk_*' into letters

    '''
    printf 'Hola' | split -b 1 - chunk_
    '''
}
```

## 3. Channel

Nextflow distinguish two different kinds of channels: queue channels and value channels. From my understanding, `value channels` only represents channel with only one value, does not mean anything special. All queries will be sent to process in parallel (so how control total thread? CpG, memory? by `cpu` parameter above?)

`of` method can be used to "create" channel from an array. 

```bash
ch = Channel.of( 1, 3, 5, 7 )
ch.view { "value: $it" }
```

What's the difference between just use an array as input and use array-produced channel as input?

`fromList` is more likely should be used for array.

```bash
Channel
    .fromList( ['a', 'b', 'c', 'd'] )
    .view { "value: $it" }
```

`fromPath` is more likey to be imported to get file path.

```bash
files = Channel.fromPath( 'data/**.fa' )
moreFiles = Channel.fromPath( 'data/**/*.fa' )
pairFiles = Channel.fromPath( 'data/file_{1,2}.fq' )
```

`fromSRA` can be used to fetch SRA data. This is a cool feature, for PGP data I think.

```bash
ids = ['ERR908507', 'ERR908506', 'ERR908505']
Channel
    .fromSRA(ids)
    .view()
```

`watchPath` &bigstar;&bigstar;&bigstar; This is really cool! It can watch certain folders, and trigger nextflow pipeline when there is any file change.

## Summary

I thought nextflow is easy, but apparently I was wrong. This is just the fist part of tutoral.