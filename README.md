# Hop Database Server

Backend Server written in Node.JS using Express and MongoDB as the database.
The server is used to store Cafe data, reviews, and userbase for Hop Cafe App.

## Features

- HTTP GET /cafe - find for cafes of a particular name
- HTTP POST /cafe - post a new cafe data on the database
- HTTP POST /bloggerReviews - post blogger reviews onto the database
- JSON Web Token (waiting to be implemented on client side)
- Retrieval from Foursquare API
- User Database
- - Implemented bcrypt for passwords
- Scraped Reviews using Google Custom Search API

## Routes for Client Side

- GET /cafe/data
- params: fsVenueId

- POST /cafe/data
- params: cafeModel

- GET /cafe/review/blogger
- params: fsVenueId

- POST /cafe/review/hopper
- params: HopperReviewModel

- GET /cafe/review/hopper
- params: fsVenueId

- POST /newuser
- params: UserModel

- POST /login
- params: userName, userPassword

- GET /nouserlogin
- params: nil

## Routes for Internal Use

- GET /foursquare/cafe
- params: fsVenueId

- GET /cafe/google
- params: name

- POST /cafe/review/blogger
- params: bloggerReviewModel

## To be Implemented

- [ ] Save cafe crowded times data https://github.com/m-wrzr/populartimes
- [ ] Reward implementation
- [ ] shift main query into backend, and search by tags/location

Developed By: Cheng Xian Hao and Elston Aw
