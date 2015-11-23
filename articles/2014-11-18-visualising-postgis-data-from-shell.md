---
title: "Visualising PostGIS data from the shell"
tags: postgres postgis
---

On and off, I've been looking for a way to quickly visualise PostGIS data from ad hoc query results. 

There are only a couple of solutions suggested by Google: one is to use some kind of plugin in QGIS which doesn't exist; another one is uDig which has a horrible UI and doesn't seem to allow visualising query results (although I could only tolerate its Eclipse-based UI for about 5 minutes before deleting the whole thing, so it's hard to be sure).  

Other possible solutions are even clunkier, such as converting the data to KML, saving to a file and then loading it in Google Earth. That's enough steps to discourage any kind of visual exploration. 

Ideally, I wanted to be able to pass queries for visualisation from a `psql` session but I don't see any way of making that happen without requiring toggling of `\o` and `\t` options, which would be inconvenient.

I was about to start writing my own script for this, but then I stumbled onto a useful solution which looks like this:

    +---------------------------------------+
    |                                       |
    |   Run query in psql and output rows   |
    |                                       |
    +-------------------+-------------------+
                        |                    
                        |                    
    +-------------------v-------------------+
    |                                       |
    |   Construct GeoJSON via geojsonify    |
    |                                       |
    +-------------------+-------------------+
                        |                    
                        |                    
    +-------------------v-------------------+
    |                                       |
    |  Pass to geojson.io via geojsonio-cli |
    |                                       |
    +-------------------+-------------------+
                        |                    
                        |                    
    +-------------------v-------------------+
    |                                       |
    |      Browser opens geojson.io with    |
    |             visualised data           |
    |                                       |
    +---------------------------------------+

To set this up, you need to do the following:

    npm install -g blackmad/geojsonify
    npm install -g geojsonio-cli
    echo "psql -d \$1 -t -c \"\$2\" | geojsonify | geojsonio" > gjio
    chmod +x ./gjio
    

The version of `geojsonify` in the NPM repository is broken, so it has to be installed from Github. 

The resulting `gjio` script can then be used like this:

    ./gjio osm "select st_astext(linestring) from ways limit 100"    

This opens geojson.io with the results of the query displayed on the map. 

A couple of notes:

- If the result set is small enough, it's passed along in the URL, but otherwise a public Gist is created on Github (so you may want to be careful with private data).
- Geometry columns have to be converted to WKT using `ST_AsText` as that's what `geojsonify` is able to convert into GeoJSON features