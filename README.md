# Techy Blog

This blog software is a simple demonstration of displaying an existing collection of blog articles.

Each blog article is a mark-down file with a specifically formatted filename and file.  Title and tag information is
available in a specific block at the top of each file.

There is also the lion's-share of the logic to save, publish and delete blog posts.  **The two systems are not 
compatible.**  They were written separately.  It would not take much to move them together, though the save, publish
and delete uses a json file to store information about the blog posts, rather than a header section at the top of each 
file.

To start the app, run ```npm start``` and browse to ```http://localhost:3000```

To run the unit tests for the back-end save, publish and delete functionality, run ```npm test```
