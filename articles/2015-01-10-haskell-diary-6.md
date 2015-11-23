---
title: "Haskell diary #6"
tags: software fp haskell diary
---

*I'm learning functional programming and writing things down as I go. Some of my understanding may be incomplete or wrong, and I expect to refine it in the fullness of time.*

After a discouraging experience with building a tiny web app in Haskell, I got a convenient opportunity to apply Haskell to a small real world problem in one of my projects. 

The idea is to load a graph out of the database, find the cycles, and write back the results. 

My hopes for database libraries were low after looking at Persistent and Esqueleto, but somehow I stumbled into [Hasql](https://github.com/nikita-volkov/hasql) a few days later. Hasql is a really nice library, and exactly what I was looking for:

- It works with Postgres
- It's written with performance in mind
- It allows me to write SQL queries conveniently instead of making me learn some sort of SQL pseudocode 
- It provides a modicum of type checking, such as checking that the right number of parameters are supplied

It's a brand new project, so I had to wait a few days until a working version appeared in Stackage. 

It's also very light on documentation, which made things hard for me, primarily due to its use of monads and monad transformers. 

I don't understand monads yet, but I learned enough to make my queries work. It took me quite a while to figure out how to collect results of multiple queries into a single result. It boiled down to this:

{% highlight haskell %}
-- take a list of node IDs and generate a list of nodes with their edges
graph <- forM nodeIds $ \((nodeId, _)) -> do
    edges :: [(NodeId, Bearing)] <- getEdges nodeId
    return $ getEdgyNode nodeId edges
{% endhighlight %}

Another cool thing I learned was the `on` function from `Data.Function`, which allowed me to express a comparison for `maximumBy` very cleanly:

{% highlight haskell %}
maximumBy (compare `on` relativeBearing) nextEdges
where relativeBearing edge = normaliseBearing (bearing edge - bearing currEdge)
{% endhighlight %}

This function finds the edge with a maximum relative bearing, so I needed to calculate the relative bearing for each edge and use the result for comparison. In my initial solution, I wrote the comparison function manually:

{% highlight haskell %}
maximumBy cmpRelativeBearing nextEdges
where relativeBearing edge = normaliseBearing (bearing edge - bearing currEdge)
      cmpRelativeBearing edge1 edge2 = compare (relativeBearing edge1) (relativeBearing edge2)
{% endhighlight %}

The `on` function is defined like this, so I could use it to express my comparison function:

{% highlight haskell %}
(*) `on` f = \x y -> f x * f y
{% endhighlight %}

Some other thoughts:

- Thinking in terms of data transformations was really helpful for this problem.
- Once I got the program to compile, I quickly got it to produce correct results; the debug-fix-run cycle was pleasantly short. I was also able to refactor the code quite easily. 
- I have some C# code for the same problem to compare to, and I expect my mix of Haskell and SQL to be just 30%-50% of the number of lines in the C# solution. 
- I think CoffeeScript line count would be on par with Haskell (and I would write the CoffeeScript solution in largely the same functional style). Of course, it wouldn't include any static type checking. It's actually quite impressive that Haskell is as terse as CoffeeScript.

