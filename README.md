# Pencil Backend Assignment

This assignment focuses on querying questions based on their associated annotations from a MongoDB database. The objective is to load question data from a CSV file, establish a connection to the database, and create a NodeJS + Express server exposing a RESTful API for querying the index and retrieving relevant questions.

# Assignment Details
## Topic Tree and Annotations
The questions are annotated with topics that follow a hierarchical structure represented by a topic tree. Each question can have one or more annotations, each corresponding to a topic in the tree.

## Topic Schema
In order to make efficient and optimized queries to find the descendants of a given topic in the tree, I followed the Materialized Path Pattern which is simply that I store each node of the topics tree as a document with the following Schema as an example: 

{
  _id: new ObjectId('657dc4d34ee36a90678cb56e'),
  name: 'State, in simple terms, the relationship between cell function and cell structure for the following:',
  path: 'Cell Structure and Organisation/State, in simple terms, the relationship between cell function and cell structure for the following:',
  __v: 0
}

Here we store the name of the topic and the unique path to that topic in the tree, the parent node path here is 'Cell Structure and Organisation'.

This is an efficient way to look up for multiple descendants for a given topic specialy if we want to scale up the database.
