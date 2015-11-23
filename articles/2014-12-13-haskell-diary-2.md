---
title: "Haskell diary #2"
tags: software fp haskell diary
---

*I'm learning functional programming and writing things down as I go. Some of my understanding may be incomplete or wrong, and I expect to refine it in the fullness of time.*

Today I was working on [CIS194 Homework 1](http://www.seas.upenn.edu/~cis194/hw/01-intro.pdf). 

I learned how to provide a modicum of interactivity - the following code reads lines in from the keyboard and then outputs text based on the input:

{% highlight haskell %}
-- Validate the given string 
validate :: String -> String
validate str = if isValid str then "Valid" else "Not valid" 

-- Use lines to break up input on \n
-- Use unlines to join multiple lines of output (and separate them by \n)
validateInput :: String -> String
validateInput input = unlines (map validate (lines input))

main :: IO ()
main = do
    putStrLn "Hello!"
    
    -- interact takes a String -> String function and 
    -- provides an input/output loop based on it
    interact validateInput
{% endhighlight %}

I believe this relies on lazy evaluation to provide an interactive input/output loop (i.e. I can enter a line and immediately see the result, then enter another one etc.).

---

Partial application is useful for writing readable code:

{% highlight haskell %}
double = map (\x -> 2 * x)
{% endhighlight %}

The `double` function doubles the elements of a list. Here, I've only passed the first argument to `map` so it's partially applied, which makes `double` a function of one argument (a list).

I've also used a lambda as the argument to map. 

---

As a concluding remark, writing stateless functions is still difficult for now.

That's it for today!