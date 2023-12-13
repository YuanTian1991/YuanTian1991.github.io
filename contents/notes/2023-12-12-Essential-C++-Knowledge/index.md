---
slug: '/notes/Essential-C++-Knowledge'
date: '2023-12-12'
title: 'Essential C++ Knowledge'
tags: ["C++"]
abstract: 'I have not code C++ for exactly 10 years after graduation from the Department of CS. Now I need to pick it up. Here are very short records help me to pick it up.'
---

## A Basic C++ Program

Firstly, below is a typical C++ program `hello.cpp`:

```cpp
#include <iostream>
using namespace std;

int main() {
  cout << "Hello World!";
  return 0;
}
```

To compile it, I need to run the below command to compile it, then an executable software "hello" will appear in the folder, we can run it.

```shell
g++ hello.cpp -o hello
```
## Include Libraries

### Standard Template Library (STL)

There are two ways mostly to include libraries, one type is called STL (Standard Template Library), they are included in standard C++, there is no need to install them separately, just use them as:

```cpp
#include <iostream>
#include <fstream>
#include <string>
#include <cassert>

using namespace std;

int main() {
  cout << "Hello World!";
  return 0;
}
```

### Manually Compile Install Third-Party Library

Another type is specific libraries like "Bamtools", they are third-party libraries and installation varies. In generally, they need to be downloaded, build (compiled), then we can included them into the C++ code. Below are my actions to add [Bamtools library](https://github.com/pezmaster31/bamtools/wiki) into the C++ code.

In a separate folder I run below command.

```shell
git clone https://github.com/pezmaster31/bamtools.git

# In the top directory
mkdir build
cd build

# Make the final compiled folder
mkdir ../../../compiled/bamtools/

cmake -DCMAKE_INSTALL_PREFIX=../../../compiled/bamtools/ ..
make
make install
```
Then the final compiled bamtools would exist in the final compiled folder. In above command, `cmake` is actually a command to create Makefile, based on CMakeLists.txt, while `make`` is the real command for compiling, create the executable software, and `make install` put the lib/include files in the final compiled folder. 

CMake is a tool to manage building of source code. To quickly learn how to write CMakelists.txt, [this](https://github.com/krux02/minimal_cmake_example) is a good example.

Anyway, now I can try include Bamtools into my hello.cpp scripts and compile it:

```cpp
#include <iostream>
#include <fstream>
#include <string>
#include <cassert>

// Bamtools
#include <api/BamReader.h>

using namespace std;

int main() {
  cout << "Hello World!";
  return 0;
}
```

Compile it as:

```shell
g++ hello.cpp -o hello -I /path/to//compiled/bamtools/include/bamtools -L /path/to/compiled/bamtools/lib -lbamtools
```

The final flag `-lbamtools` means my `hello.cpp` code will "link" with bamtools, so in the compile stage, the separately compiled third-party library - bamtools - will be linked togather with my code. Each third-party library will have it's own flag, mostly it should be like "-l\[LibraryName\]".

## MakeFile vs CMakeFile.txt

This are compiled object file, which is not executable, and need later to be linked. Each .cpp file will be compiled into one .o file, and then linkage process will be applied to join them.

Below is an example of MakeFile to compile them all:

```MakeFile
CXX = g++
CXXFLAGS = -std=c++11 -Wall

# List of source files
SRCS = main.cpp math.cpp

# Generate object file names from source file names
OBJS = $(SRCS:.cpp=.o)

# Executable name
TARGET = myprogram

all: $(TARGET)

$(TARGET): $(OBJS)
    $(CXX) $(CXXFLAGS) -o $@ $^

# Rule to generate object files
%.o: %.cpp
    $(CXX) $(CXXFLAGS) -c $< -o $@

clean:
    rm -f $(OBJS) $(TARGET)
```

Below is an example of Cmake's CMakeLists.txt::

```CMakeLists.txt
cmake_minimum_required(VERSION 3.10)

project(MyProgram)

# Set the path to the C++ compiler (g++)
set(CMAKE_CXX_COMPILER "/path/to/g++")

# Add your source files
add_executable(myprogram main.cpp math.cpp)

# Specify include directories
target_include_directories(myprogram PRIVATE ${CMAKE_CURRENT_SOURCE_DIR})
```

Then, the compile and run step is:

```shell
mkdir build
cd build
cmake ..
make
```

**In the above comparison, it looks like cmake have a significant advantage in doing this job.**

## A typical C++ Project Structure

Below is a typical C++ project strucuture.

```shell
/project
|-- CMakeLists.txt
|-- include
|   |-- project_name
|       |-- header1.h
|       |-- header2.h
|-- src
|   |-- main.cpp
|   |-- source1.cpp
|   |-- source2.cpp
|-- tests
|   |-- test_main.cpp
|   |-- test_source1.cpp
|   |-- test_source2.cpp
|-- external
|   |-- lib
|   |   |-- external_lib.a
|   |-- include
|       |-- external_header1.h
|       |-- external_header2.h
|-- build
|-- bin
|   |-- myprogram  (Executable)
|-- docs
|-- .gitignore
|-- build_and_test.sh
```

The `build_and_test.sh` would be like below:

```shell
#!/bin/bash

# Create build directory if it doesn't exist
mkdir -p build

# Run CMake to configure the project
cmake -S . -B build

# Build the project using make
cmake --build build

# Run the tests (assuming you have a test executable)
./build/tests

# Run the main program (replace 'myprogram' with your actual executable name)
./build/myprogram
```

Well, I guess I will need to use print as the debug solution then 😄.

The CMakeLists.txt would be vital here, below is an example that includes multiple .cpp file linkage and external libraries.

```
# CMakeLists.txt

# Specify the minimum version of CMake required
cmake_minimum_required(VERSION 3.10)

# Project name
project(MyProject)

# Set C++ standard
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Include directories for project headers
include_directories(include)

# External library include directories
include_directories(external/include)

# Add source files in the src directory
add_executable(myprogram
    src/main.cpp
    src/source1.cpp
    src/source2.cpp
)

# Add external library source files if needed
# add_library(external_lib STATIC external/lib/external_lib.cpp)

# Link external libraries
# target_link_libraries(myprogram external_lib)

# Example if you have external libraries in the external directory
add_library(external_lib STATIC external/lib/external_lib.cpp)

# Link external libraries
target_link_libraries(myprogram external_lib)
```

## Syntax

### head file

head file can be used for anything, but I think a better implementation is to couple it with a cpp file, which will be compiled into .o file, and later linked with the main.cpp program. So in hte .cpp program, there are two ways to include .h file:

```cpp
#include <something.h>

#include "something.h"
```

The angle bracket should be used for 3 situations: Standard Library Headers, External Library Headers, and Compiled Object Modules. The `""` will be used to find header file in this exact location.