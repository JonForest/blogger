---
title: "Haskell diary #3"
tags: software fp haskell diary
---

*I'm learning functional programming and writing things down as I go. Some of my understanding may be incomplete or wrong, and I expect to refine it in the fullness of time.*

Today I worked on [CIS194 Homework 2](http://www.seas.upenn.edu/~cis194/hw/02-dict.pdf). 

A few interesting constructs from this bit of code below.

I found myself using the `$` operator for function composition quite a bit: 

{% highlight haskell %}
scrabbleValueTemplate :: STemplate -> String -> Int
scrabbleValueTemplate stemplate word = 
    (product $ map multiplier stemplate) * (sum $ map tplValue (zip stemplate word))
{% endhighlight %}

It's cleaner than parentheses. 

---

Binary operators can be partially applied by providing just the first or just the second argument, for example:

{% highlight haskell %}
filter (/= '?')
{% endhighlight %}

---

The `where` clause is also very good for readability: 

{% highlight haskell %}
bestWords :: [String] -> [String]
bestWords words = filter (\word -> scrabbleValueWord word == maxValue) words
    where maxValue = maximum $ map scrabbleValueWord words
{% endhighlight %}

In most cases it's probably cleaner to create a named function in the `where` clause instead of a lambda. I also find the `where` clause more convenient than `let... in`.

--- 

I also started Erik Meijer's [EdX FP101 course](https://www.edx.org/course/delftx/delftx-fp101x-introduction-functional-2126). So far it looks too basic for me but I'll stick with it for the exercises for now. 

That's it for today!