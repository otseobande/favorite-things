# Favorite Things! 🙂
[![Build Status](https://travis-ci.com/otseobande/favorite-things.svg?branch=master)](https://travis-ci.com/otseobande/favorite-things) [![codecov](https://codecov.io/gh/otseobande/favorite-things/branch/master/graph/badge.svg)](https://codecov.io/gh/otseobande/favorite-things) [![Netlify Status](https://api.netlify.com/api/v1/badges/01276058-5a4f-431f-a750-18e6b345ac9b/deploy-status)](https://app.netlify.com/sites/favorite-things/deploys)

An application to help you track your favorite things.

[Hosted Application](https://favorite-things.netlify.com)

![Screenshot](https://res.cloudinary.com/otse/image/upload/v1565183640/Screen_Shot_2019-08-07_at_2.11.20_PM_sz8wyu.png)

## Getting Started

The project is divided into two: the client and the server. The client section is located within the `client` folder and the server files are kept in the root directory

### Installation

copy .env.example to a .env file and update the credentials

```bash
cp .env.example .env
```


Install python dependencies

```bash
pip install -r requirements.txt
```

To install the client dependencies, navigate to the client folder

```bash
cd ./client
```

Install dependencies with NPM

```bash
npm install
```

### Start development servers

Start backend server

```bash
python manage.py runserver
```

Start client server

```bash
cd ./client && npm run serve
```

## Entity relationship

![Entity relationship diagram](https://res.cloudinary.com/otse/image/upload/v1565093595/entity_relationship_ythju7.png)

## API Documentation

- [Postman documentation](https://documenter.getpostman.com/view/3424044/SVYrse29?version=latest)

## Deployment Process

The frontend application (VueJs) is deployed using [Netlify](https://netlify.com). Netlify handles the build and deployment for the Vue app.

The backend is deployed on [AWS Lambda](https://aws.amazon.com/lambda/) using [Zappa](https://github.com/Miserlou/Zappa).

Deployment is automated with Travis CI build stages.
