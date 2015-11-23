---
title: "Haskell diary #4"
tags: software fp haskell diary
---

*I'm learning functional programming and writing things down as I go. Some of my understanding may be incomplete or wrong, and I expect to refine it in the fullness of time.*

Yesterday I worked on [CIS194 Homework 3](http://www.seas.upenn.edu/~cis194/hw/03-ADTs.pdf). I started to question my approach of trying to write code first and reading up on Haskell features as necessary. It's proving to be quite challenging. Perhaps working through a book first would be more reasonable. 

Pattern matching on constructors proved to be challenging to wrap my head around. I found it strange that the compiler has enough information to figure out exactly how a value was constructed. 

However, once I got a bit comfortable with it, I was able to write code like this:

{% highlight haskell %}
where sortedMessages = sortMessages [ m | m <- ms, highSeverity m ]
      highSeverity (LogMessage (Error sev) _ _) = sev >= 50
      highSeverity _ = False 
{% endhighlight %}

I also found myself using a few list comprehensions like the above. They provide convenient syntactic sugar to combine `map` and `filter`: 

{% highlight haskell %}
[ show m | m <- ms, isInfixOf (lowerCaseText m) (lowerCase s) ]
{% endhighlight %}

---

I had to parse strings like `"E 2 562 help help"` in this exercise. I ended up writing a bunch of nested `case` expressions:

{% highlight haskell %}
case first of 
    "I" ->
        case readInt second of
            (ValidInt n) -> ValidLM $ LogMessage Info n (unwords (third : rest))
            InvalidInt -> InvalidLM s
    "W" ->
        case readInt second of
            ValidInt n -> ValidLM $ LogMessage Warning n (unwords (third : rest))
            InvalidInt -> InvalidLM s
    "E" -> 
        case readInt second of 
            InvalidInt -> InvalidLM s
            ValidInt n -> 
                case readInt third of
                    InvalidInt -> InvalidLM s
                    ValidInt m -> ValidLM $ LogMessage (Error n) m (unwords rest)
    _   -> InvalidLM s
{% endhighlight %}

This is clearly ugly (similar I and W cases, repeated `InvalidLM` construction), but so far I'm not sure how to make it better. I have a feeling more pattern matching could be in order.

---

I learned a couple of other things. One is that pattern matching can also be used in lambdas:

{% highlight haskell %}
map (\(ValidLM m) -> m) (filter f ms)
{% endhighlight %}

The other is that I could write destructuring assignment like this:

{% highlight haskell %}
where (first : second : third : rest) = words s
{% endhighlight %}

Even though this worked, I'm not sure whether the left hand side should really be a list, or whether a tuple would make more sense.
