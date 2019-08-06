# Favorite Things! 🙂
[![Build Status](https://travis-ci.com/otseobande/favorite-things.svg?branch=master)](https://travis-ci.com/otseobande/favorite-things) [![codecov](https://codecov.io/gh/otseobande/favorite-things/branch/master/graph/badge.svg)](https://codecov.io/gh/otseobande/favorite-things)

An application to help you track your favorite things.

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
cd ./client && npm run server
```

### Entity relationship

![Entity relationship diagram](https://res.cloudinary.com/otse/image/upload/v1565093595/entity_relationship_ythju7.png)



