# My Top Favorite Web Application - React Front End

## Table of Content

1. [Application Overview](#application-overview)
2. [Front End Description](#front-end-description)
3. [Technologies](#technologies)
4. [Installation](#installation)
5. [Getting Started](#getting-started)

---

## **Application Overview** <a name="application-overview"></a>

My Top Favorite is a social media platform where registered users can create, edit and share lists containing a rank of their favorite things of a certain theme. Along with each list item, the user has the option to attach a personalized text talking about the chosen item. Users can also follow other users to keep up with their listings.

The platform is integrated with external APIs, therefore, when creating a list, the user can search for items belonging to that theme in reliable sources. As an example, a user creating a list of his favorite action movies will be able to search for them in the collection of the Tmdb platform.

Currently the platform supports lists with themes related to movies, series and public personalities.The theme possibilities are endless and new themes will be supported soon!

## **Front End Description** <a name="front-end-description"></a>

The platform implementation is split into two repositories. This repository contains the React front end and [this repository](https://github.com/AmandaFI/MyTopFavorite-Web-Application-Backend.git) contains the API implemented using Ruby on Rails.

The user interface was implemented using the front end library React and the TypeScript programming language. The library Material UI was used for styling the interface components and the Vite tool was used to run and build the project.

The axios promise-based HTTP Client was used to consume the [implemented Rails API](https://github.com/AmandaFI/MyTopFavorite-Web-Application-Backend.git). As mentioned in the [overview section](application-overview) the platform interacts with external APIs and currently all data ranked in the lists is fetched from the [Tmdb API](https://developer.themoviedb.org/reference/intro/getting-started) using axios. In the future other external APIs will be added to the platform.

There are 6 main pages in the interface:

- Sign Up: used to register new users.
- Sign In: used to login into the platform.
- Feed: page where the user can see and interact with the lists shared by the users he follows and search for other users profiles.
- User private area: page where the user can manage his published and drafted lists.
- Edit list area: page where the user can create and edit lists.
- User public profile: page where public information and lists of a searched user are displayed and where one user can follow/unfollow another user.

## **Technologies** <a name="technologies"></a>

- [TypeScript](https://www.typescriptlang.org/) version 5.0.2
- [React](https://react.dev/) version 18.2.0
- [Vite](https://vitejs.dev/) version 4.3.2
- [Axios](https://www.npmjs.com/package/axios) version 1.4.0
- [Material UI](https://mui.com/) version 5.12.3
- [Tmdb API](https://developer.themoviedb.org/reference/intro/getting-started)

## **Installation** <a name="installation"></a>

To run this project locally the following prerequisites are necessary:

- Node.js installed
- npm installed

If your system does not meet the mentioned prerequisites, install Node.js. npm is included with Node.js, so you don’t have to install it separately. The Node.js installation can be executed followig the commands bellow:

### **Linux systems**

1 - If not installed, install curl:

```bash
$ sudo apt install curl
```

2 - Find the correspondent curl command for your Linux distro in the [node repository](https://github.com/nodesource/distributions/blob/master/README.md#debinstall) and run it on bash. Example for Ubuntu:

```bash
$ curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - &&\
```

3 - Install the Node.js:

```bash
$ sudo apt-get install -y nodejs
```

### **macOS and Windows systems**

Download macOs installer and Windows installer respectively from the [official site](https://nodejs.org/en/download) and follow the installation steps presented.

## **Getting Started** <a name="getting-started"></a>

If your system meets the mentioned prerequisites just clone this repository and run the following initialization commands:

```bash
$ git clone https://github.com/AmandaFI/MyTopFavorite-Web-Application-Frontend.git
$ cd MyTopFavorite-Web-Application-Frontend
```

Install the project packages:

```bash
$ npm install
```

Run the Vite server:

```bash
$ npm run dev
```
