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
