# BackEndProject

Purpose of the application is to show useful events to the user and populate more interest in event in Capital Region. It also shows the weather for the upcoming events. That way making it easier to decide when to go to a specific event.



# What does it do?

This is the backend designed to serve data from our own mongoose database. There is a graphiql interface to experiment with the data you get.

# Getting started

1. Clone master repo to your own device
2. npm install
3. npm start
4. npm test
    + All test should be passed
    + if not -> contact to the contributor 
5. After test are passed you can go to http://localhost:3001/Graphql
6. There is a docs on the upper right corner (There is also a list of queries and mutations at the bottom) 
7. You can get started with query {events{id}}

# Help

+ If you find bugs or you have an problem. Create a issue in github

# Contributors

+ Emil Toivainen
+ Timurhan Çalisiyor


# Graphql queries & mutations

## Query

+ events
+ event 
+ route
+ user
+ users
+ userLogin
+ reservations
+ reservation 
+ DeleteOldEvents
+ UpdateEvents
+ UpdateWeather

## Mutation

+ UserRegister
+ UserModify
+ UserDelete
+ UserRemoveReservation
+ User AddInterest
+ UserRemoveInterest
+ UserAddFriend
+ UserRemoveFriend
+ UserAddReservation
+ UserRemoveReservation

### AdminMutation

+ deleteOldEvents
+ updateEvents
+ updateWeather