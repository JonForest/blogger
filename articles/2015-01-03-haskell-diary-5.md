---
title: "Haskell diary #5"
tags: software fp haskell diary
---

*I'm learning functional programming and writing things down as I go. Some of my understanding may be incomplete or wrong, and I expect to refine it in the fullness of time.*

As I was working through various Haskell exercises, I realised that while I enjoyed Haskell as a language, I was no closer to understanding how *practical* it is. So yesterday I decided to try approaching it from a different angle. Instead of writing small console programs, my goal for the day would be to write a minimal web application which connects to a PostgreSQL database and pulls some data out. 

I'd done some research on Haskell web frameworks previously, and it looked like the best options (i.e. actively maintained, mature and reasonably popular) were [Yesod](http://yesodweb.com) and [Scotty](https://github.com/scotty-web/scotty).

I mostly structure my web apps to render the UI on the client, with the server primarily providing a JSON interface to the data. This happens to be the general trend in web development. However, from my cursory look at Yesod, it appears to be geared towards server side page generation, which felt a bit antiquated. 

Scotty, being a minimal framework, seemed to fit my needs quite a bit better, so that's what I used.

I primarily relied on two articles while making this web app:

- [Making a website with Haskell](http://adit.io/posts/2013-04-15-making-a-website-with-haskell.html)
- [*Persistent* chapter in the Yesod book](http://www.yesodweb.com/book/persistent)

There are three main points I took from this experiment. 

## 1. Insane dependency build times

For my tiny web app, `cabal-install` performed half an hour of furious compiling (on a newish Macbook Pro) and produced 300MB of output. That was not encouraging!

Apparently, it causes difficulties with deployment too. For example, Heroku allows Haskell deployment, but it has a cutoff (15 minutes?) for build times, which means that some trickery (like using an external build service) is needed to deploy apps.

## 2. Haskell SQL abstractions are as bad as any ORM

Just like ORMs in other languages, Haskell libraries for dealing with databases suffer from the issue of reinventing the SQL syntax (poorly). I get that the goal is to provide type checked queries, but I still want to write normal SQL and have *that* statically checked against the DB schema.

Here is an example of a query in Persist (which is sort of the Haskell analog to ActiveRecord):

{% highlight haskell %}
people <- selectList
   (       [PersonAge >. 25, PersonAge <=. 30]
       ||. [PersonFirstName /<-. ["Adam", "Bonny"]]
       ||. ([PersonAge ==. 50] ||. [PersonAge ==. 60])
   )
{% endhighlight %}

It looks pretty ugly in my opinion, and as usual, reinvents SQL only partially, providing an escape hatch to raw SQL. I quickly ran into limitations even in my tiny, useless web app: it turns out that Persist doesn't support the `hstore` column type. 
   
Or take a look at a query in Esqueleto, another library building on top of Persist. To express a query like this:

{% highlight sql %}
SELECT * 
FROM Person
WHERE age >= 18
{% endhighlight %}

you need to write this:

{% highlight haskell %}
select $
from $ \p -> do
where_ (p ^. PersonAge >=. just (val 18))
return p
{% endhighlight %}

This is just nuts. I count **9** bits of syntax I have to remember in this trivial query. It's like it tries hard to get into the uncanny valley where it looks *almost* like SQL, except it fails miserably. 

I suppose the problem of interfacing programming languages with relational databases remains unresolved, unless I just haven't found the right Haskell library.

## 3. Haskell doesn't allow learning from the top down

I think quite a lot of web developers started creating web apps with the Ruby on Rails framework before learning the intricacies of Ruby. I'm pretty sure I only figured out Ruby metaprogramming after unknowingly using it in Rails. 

Haskell doesn't allow this kind of frivolity. For example, I spent a lot of time just to go from connecting to SQLite (as in the article I was using) to connecting to Postgres. This is the function in question:

{% highlight haskell %}
runDb :: SqlPersistT (LoggingT IO) a -> IO a
runDb query = do
    runStderrLoggingT . withPostgresqlConn "postgres://a:a@localhost:5432/osm" $ runSqlConn query
{% endhighlight %}

Also, here is the list of imports for my app, which tells something about the complexity:

{% highlight haskell %}
{-# LANGUAGE OverloadedStrings #-}
import Web.Scotty
import Text.Blaze.Html5 hiding(map)
import Text.Blaze.Html5.Attributes
import qualified Web.Scotty as S
import qualified Text.Blaze.Html5 as H
import qualified Text.Blaze.Html5.Attributes as A
import Text.Blaze.Html.Renderer.Text

import Data.Text (Text)
import Data.Time (UTCTime, getCurrentTime)
import qualified Data.Text as T
import Control.Monad.IO.Class (liftIO)
import Control.Monad.Logger (runStderrLoggingT)

import Network.Wai.Middleware.Static

import Database.Persist hiding(get)
import Database.Persist.Sql hiding(get)
import Database.Persist.Postgresql (withPostgresqlConn)

import Control.Monad (forM_)
import Control.Applicative
import Control.Monad.Logger
{% endhighlight %}

I also think a working understanding of monads would be extremely helpful. I don't have it yet, so I was floundering when I tried to deviate from example code and get my web app to output something different. 

## Conclusion

I came away from this experiment disappointed. Regrettably, I think I have to come back to web apps later, when I learn some more Haskell concepts.  

