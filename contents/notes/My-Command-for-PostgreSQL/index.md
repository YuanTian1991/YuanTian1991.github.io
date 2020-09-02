---
slug: "/notes/my-command-for-postgreSQL"
date: "2020-07-06"
title: "My Command for PostgreSQL"
tags: ['postgreSQL']
abstract: "Recently one of my project is using postgreSQL, here I just record a bit common command I used to manipulate postgreSQL."
---

This is just a simple post for me to record my commonly used postgreSQL command.

Type `psql` in bash to enter postgreSQL session. I did not use root here.

```bash
macos@macs-iMac  ~/MySpace  psql
psql (12.2, server 12.1)
Type "help" for help.

macos=#
```

### Create New User with Password

Use below command to create a user **with** password

```bash
macos=# CREATE USER demo WITH PASSWORD 'demo123';
CREATE ROLE
```

### Create New Databse for Certain User

Below command works.

```bash
macos=# CREATE DATABASE phenopolis_db_demo OWNER demo;
CREATE DATABASE
```

### Check all Database

User `\list`

```bash
macos=# \list
                                      List of databases
        Name        |  Owner   | Encoding |   Collate   |    Ctype    |   Access privileges
--------------------+----------+----------+-------------+-------------+-----------------------
 MGQdb              | macos    | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
 MGQdb_test         | macos    | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
 macos              | macos    | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
 phenopolis_db_demo | demo     | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
 postgres           | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
 template0          | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/postgres          +
                    |          |          |             |             | postgres=CTc/postgres
 template1          | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/postgres          +
                    |          |          |             |             | postgres=CTc/postgres
(7 rows)
```

### Remove Database

Here I search a bit, **If the database name contains upper-case letter, the databse name need to be put in ""**.

```bash
macos=# DROP DATABASE  "MGQdb";
DROP DATABASE
macos=# DROP DATABASE  "MGQdb_test";
DROP DATABASE
macos=# \l
                                      List of databases
        Name        |  Owner   | Encoding |   Collate   |    Ctype    |   Access privileges
--------------------+----------+----------+-------------+-------------+-----------------------
 macos              | macos    | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
 phenopolis_db_demo | demo     | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
 postgres           | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
 template0          | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/postgres          +
                    |          |          |             |             | postgres=CTc/postgres
 template1          | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/postgres          +
                    |          |          |             |             | postgres=CTc/postgres
(5 rows)
```