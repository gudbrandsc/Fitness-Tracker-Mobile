# fitness-tracker-api

### Fitness Tracker Draft Specification 
For a full overview of the project please read: 
https://docs.google.com/document/d/1uCCnlcW_Ab8f4VSCjUPLB9kUPTuG0aGa3qbbrmxjknY/edit?usp=sharing



## Introduction

As an increasing number of people place a greater emphasis on personal health and fitness, we believe Fitness Tracker will be of great significance. Fitness Tracker is a cross-platform, mobile application that makes it easy for users to improve their health and increase exercise productivity. Fitness Tracker will provide features to help track workouts, monitor fitness progress, look up exercise-related information, and connect with individuals who share similar goals. The features provided in our application are unique and set us apart from other applications on the market. This in turn gives our application the ability to assist users in reaching their fitness goals quickly while also having fun.


## Motivation

Currently the majority of fitness applications provide users with a list of exercises for particular muscle groups but there is no way for the users to document their progress over a period of time. In addition, current applications do not provide a way to connect with people who have similar fitness goals which would give people greater insight on how to conduct better workout sessions and give them greater motivation. Also current applications do not provide the users with an option to calculate their monthly expenses which would include fitness club, food, dietary supplements, vitamins, workout gear, and other expenses. For a user who wants convenient access to all these features, they would need to use separate applications. Fitness Tracker will provide a central location for these services that will be convenient to use and provide intuitive user experience.


## Design Overview

**Frontend**

We use React Native to bring an efficient and portable web development to the smartphone. 
React Native provides us with the benefits of maximum code-reuse, strong performance for mobile environments along with the modular and intuitive architecture  similar to React.

**Backend**

We used Node.js to develop our server which provides an event driven, non-blocking IO and cross platform runtime environment for building server-side applications.
We stored data in the Postgres database which is a relational database management system.
We used Sequelize as an ORM(Object Relational Mapper) which provides easy access to Postgres data by mapping database entries to objects and vice-versa. 

**Platforms**

We use ElephantSQL as a PostgreSQL database hosting service. It is integrated to several cloud application platforms which manages administrative tasks, upgrades and backup handling.
We used Cloudinary which is Software-as-a-service(SaaS) solution for managing the application’s media assets in the cloud.







<a href="https://imgur.com/3ppVSbM"><img src="https://i.imgur.com/3ppVSbM.png" title="source: imgur.com" /></a>
