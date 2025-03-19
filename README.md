# Poker Seating App
This is a Next.js project made with a Typescript front-end and AWS back-end that was inspired by the Software Engineering course at WPI.  

The app allows a user to log in as a host to create and manage games or log in as a player to find and join games.  

The app is no longer functional due to the deconstruction of the AWS back-end, but some parts of the front end can still be accessed within a local host after cloning this repository and running `npm install` followed by `npm run dev`.

[Here](https://youtu.be/I88bp4J6d9E) is a video showing the functionality and features of the app while it was still up.  

# Amazon Web Services
A relational database was used to store information. This was done within AWS RDS and the creation of the tables can be found in the sql folder.  

Each lambda function, found in the lambda folder, exists within AWS lambda and is used to manipulate or query the database.  

AWS API Gateway was used for invoking the lambda functions and the specific calls can be found in src/app/page.tsx.

# Improvements to be made
1. Updated styling and more uniform appearance.  

2. More game information displayed such as location.  

3. More capabilities for hosts and players. Some ideas are below.  

Hosts:
- Update account information.  
- Remove players from games.  
- View game statistsics.  

Players:
- Update account information.  
- Joining restrictions such as only joining one game for a certain day.
