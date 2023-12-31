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

```bash
Topic: {
      "_id": "657dc4d34ee36a90678cb56e",
      "name": 'Bacteria',
      "path": 'Biology/Cell Structure and Organisation/Prokaryotic Cells/Bacteria',
      "__v": 0
}
```
Here, the path attribute is crucial, representing the full path from the root to the current topic. It efficiently encapsulates the hierarchy, making it easy to navigate.

## How it Works:
### Efficient Querying:

To find all descendants of a given topic, I'm executing the query using a regular expression on the path attribute.
For instance, to find all descendants of "Prokaryotic Cells," query for documents where the path starts with 'Biology/Cell Structure and Organisation/Prokaryotic Cells/'.
### Scalability:

The Materialized Path Pattern scales well as it allows for efficient querying of descendants.
Indexing the path attribute further enhances query performance.

## Question Schema

```bash
Question: {
        "_id": "657dc55fbe1c101b9d0a1d6f",
        "number": 187,
        "annotations": [
            "657dc4d54ee36a90678cb57e",
            "657dc4e14ee36a90678cb65c"
        ],
        "__v": 0
    }
```

Question Document stores the number of the questions and array of annotations' IDs refering to the topic document.

## Indexes

I added index on the following fields to improve the query performance:
- annotations field in question document
- path field in topic document
- name field in topic document

# Example request URL

## Endpoint
```bash
http://localhost:3000/search?q=Movement%20of%20Substances
```
**This Topic has 3 Descendants :**

**1- Define diffusion and describe its role in nutrient uptake and gaseous exchange in plants and humans**

An annotation to 4 Question which are [1, 13, 40, 61]

**2- Define osmosis and describe the effects of osmosis on plant and animal tissues**

An annotation to 0 questions

**3- Define active transport and discuss its importance as an energy-consuming process by which substances are transported against a concentration gradient, as in ion uptake by root hairs and uptake of glucose by cells in the villi**

An annotation to 2 Questions which are [1, 187]

And this is the final Questions array returned with the related questions.

![image](https://github.com/muhhammdsallam/pencil-backend-assignment/assets/81472165/3e526069-4c57-4857-bdc5-c4a09a7afb35)


# Accessing the server

I hosted the Server on AWS EC2 instance in order to allow you query the topic

To access the server connect to the following IP address

```bash
http://34.224.32.242:3000/
```

# Accessing the Database

To access the Database you can use the MONGO_URI in the .env file

