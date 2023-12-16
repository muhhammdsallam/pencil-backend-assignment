# Pencil Backend Assignment

This assignment focuses on querying questions based on their associated annotations from a MongoDB database. The objective is to load question data from a CSV file, establish a connection to the database, and create a NodeJS + Express server exposing a RESTful API for querying the index and retrieving relevant questions.

# Assignment Details
## Topic Tree and Annotations
The questions are annotated with topics that follow a hierarchical structure represented by a topic tree. Each question can have one or more annotations, each corresponding to a topic in the tree.

## Topic Schema

Example Topic Tree:
Consider a topic tree related to Biology:

- Biology
  - Cell Structure and Organisation
    - Prokaryotic Cells
      - Bacteria
    - Eukaryotic Cells
      - Animal Cells
      - Plant Cells
        
### Document Representation:

In order to make efficient and optimized queries to find the descendants of a given topic in the tree, I followed the Materialized Path Pattern which is simply that I store each node of the topics tree as a document with the following Schema as an example: 

Topic: {

  _id: new ObjectId('657dc4d34ee36a90678cb56e'),
  
  name: 'Bacteria',
  
  path: 'Biology/Cell Structure and Organisation/Prokaryotic Cells/Bacteria',
  
  __v: 0
  
}

Here, the path attribute is crucial, representing the full path from the root to the current topic. It efficiently encapsulates the hierarchy, making it easy to navigate.

## How it Works:
### Efficient Querying:

To find all descendants of a given topic, I'm executing the query using a regular expression on the path attribute.
For instance, to find all descendants of "Prokaryotic Cells," query for documents where the path starts with 'Biology/Cell Structure and Organisation/Prokaryotic Cells/'.
### Scalability:

The Materialized Path Pattern scales well as it allows for efficient querying of descendants.
Indexing the path attribute further enhances query performance.

# Example request URLs

## Endpoint 1

http://localhost:3000/search?q=Movement of Substances

This Topic has 3 Descendants and 5 related questions to the annotations

![image](https://github.com/muhhammdsallam/pencil-backend-assignment/assets/81472165/3e526069-4c57-4857-bdc5-c4a09a7afb35)


