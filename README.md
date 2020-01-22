#                                                 WordSearchAPI

___

## Description : -

### WordSearchAPI achieves the following objectives : -

It takes multiple paragraphs separated by two new lines, and update them in our DataBase.

Given a single word to find it displays the top 10 paragraphs with the most frequent appearances of the word.

___

## Points To Note : -

* App Tokenizes the paragraph to word by splitting at whitespace.

* Convert all words to lowercase for search and before storing.

* Index these words against the documents they are from.

*  A paragraph is defined by two newline character.

* Input is case insensitive for the search

___
## Installation and Usage

* Run `npm install` to install packages
* Run `node app` to run the server 
* Visit [http://localhost:5000/](http://localhost:5000/)
___

## How To Use : -

* Input Paragraphs : - Write your paragraphs separated by two lines.
* Word Search :- Search the word in the search area provided (case insensitive).
* Clear Index : - Drops the database, i.e. deletes all the previous input paragraphs.
___

## Stack Used : -
* MongoDB
* Express.js
* Node.js
___

## Deployment Link : -

[Click To See Deployment](https://wordsearch-api.herokuapp.com/Home)
