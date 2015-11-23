---
title: "Installing PostGIS with Homebrew"
tags: software mac postgres postgis homebrew
---

The PostGIS web site doesn’t currently provide instructions for installing PostGIS with Homebrew, so I wrote down the required steps.

To install the current version, run

    brew install postgis
    
Afterwards, follow the instructions on [postgis.net/install](postgis.net/install) to enable the extension in Postgres.

It’s also possible to install an older version. Run

    brew search postgis
    
It will output something like this:

    postgis
    brew/versions/postgis15   brew/versions/postgis20
    
This tells us that in addition to the current version, Homebrew has PostGIS 1.5 and 2.0 available in the Versions repository. First, you need to enable it with

    brew tap homebrew/versions
    
Then, you can install PostGIS 2.0, for example:

    brew install postgis20
    
Note that an older version may depend on an older version of PostgreSQL, so it may install it alongside the version you have. For example, `postgis20` depends on Postgres 9.2.
