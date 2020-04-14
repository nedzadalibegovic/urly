# Authentication and Authorization

Authentication is done using [JSON Web Tokens](https://tools.ietf.org/html/rfc7519), with two tokens (an access and a refresh token). Access tokens carry the necessary information to access a resource directly, they are short-lived and have a lifespan of **15 minutes**. Refresh tokens cannot be used to access resources, rather they are used to get new access tokens after they expire. Refresh tokens can also expire but are long-lived and have a lifespan of **7 days**.

| Token          | Type          | Details                                                |
| -------------- | ------------- | ------------------------------------------------------ |
| `accessToken`  | Access token  | 15 minute lifespan, used to access resources directly. |
| `refreshToken` | Refresh token | 7 day lifespan, used to get new access tokens.         |

## Authentication

To authenticate, please refer to the [`/login`](#login) endpoint. On success a httpOnly `refreshToken` cookie will be set that can be used with the [`/token`](#token) endpoint to get new access tokens after they expire.

## Authorization

Authorization is done using Bearer Tokens, i.e. all requests the require authorization must have an `Authorization` header set with a `Bearer <accessToken_here>` value.

# Status Codes

| Status Code | Description                                                             |
| ----------- | ----------------------------------------------------------------------- |
| 200         | The request has succeeded.                                              |
| 304         | The client's cached data is valid and there's no need to transfer data. |
| 307         | Temporary redirect, mainly used for the redirection functionality.      |
| 400         | Bad request.                                                            |
| 403         | Invalid authentication details.                                         |
| 404         | Resource not found.                                                     |
| 500         | The server encountered an error.                                        |

# Endpoints

| Endpoint    | Methods            | Details         |
| ----------- | ------------------ | --------------- |
| `/register` | POST               | [🔗](#register) |
| `/login`    | POST, DELETE       | [🔗](#login)    |
| `/api`      | GET, POST          | [🔗](#api)      |
| `/api/:id`  | GET, PATCH, DELETE | [🔗](#api)      |
| `/token`    | GET                | [🔗](#token)    |

## /register

### POST /register

Use this endpoint to create a new `User` object.

#### Request:

The `username` and `password` fields are required.
The `username` field must be at least 4, at most 20, characters long.
The `password` field must be at least 8 characters long.

```json
POST /register

{
    "username": "john.doe",
    "password": "password"
}
```

#### Response:

```json
200 OK

{
    "_id": "5e94ee5400b19d3a3c8457bb",
    "username": "john.doe",
    "password": "$2b$10$Ex.y6Lt2oxDsC3J8LChpK.J1AEqr5Fxs0QHSwn7jIvr.Rruyoqzhm",
    "createdAt": "2020-04-13T22:57:24.294Z",
    "updatedAt": "2020-04-13T22:57:24.294Z"
}
```

## /login

### POST /login

Use this endpoint for acquiring authentication tokens.

#### Request:

The `username` and `password` fields are **required**.

```json
POST /login

{
    "username": "john.doe",
    "password": "password"
}
```

#### Response:

The `refreshToken` field is also saved as a cookie.

```json
200 OK

{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTc2OTdlZGQ1NGNjYzMyYTgzOGI3NzgiLCJpYXQiOjE1ODY4MTYyNTksImV4cCI6MTU4NzQyMTA1OX0.4iQA6K3YdMPxvdR_Y4Z91NWiOsCTmNOyBtqwhWev6Zc",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTc2OTdlZGQ1NGNjYzMyYTgzOGI3NzgiLCJpYXQiOjE1ODY4MTYyNTksImV4cCI6MTU4NjgxNjMxOX0.Xo0WvHoTvo4wApwyh_LcYEpeWh4a0gskUBKMy_hkwY8"
}
```

### DELETE /login

Use this endpoint for logging out.

#### Request:

Make sure to send the `refreshToken` cookie with this request.

```json
DELETE /login

{}
```

#### Response:

```json
200 OK

{
    "message": "User john.doe logged out"
}
```

## /api

**All `/api` endpoints require authorization.**

### GET /api

Use this endpoint to fetch all `URL` objects.

#### Request:

```json
GET /api

{}
```

#### Response:

```json
200 OK

[
    {
        "_id": "5e93368821e33e29d8f505fc",
        "title": "Refs and the DOM – React",
        "url": "https://reactjs.org/docs/refs-and-the-dom.html",
        "createdAt": "2020-04-12T15:40:56.809Z",
        "updatedAt": "2020-04-12T15:40:56.809Z"
    },
    {
        "_id": "5e9336bf21e33e29d8f505fd",
        "title": "Web APIs",
        "url": "https://developer.mozilla.org/en-US/docs/Web/API/",
        "createdAt": "2020-04-12T15:41:52.449Z",
        "updatedAt": "2020-04-12T17:54:27.004Z"
    },
    {
        "_id": "5e9355b7de16cd2e70928e22",
        "title": "GitHub",
        "url": "https://github.com/",
        "createdAt": "2020-04-12T17:54:00.341Z",
        "updatedAt": "2020-04-12T17:54:00.341Z"
    }
]
```

### GET /api/:id

Use this endpoint to fetch a specific `URL` object based on the `id` parameter.

#### Request:

```json
GET /api/5e93368821e33e29d8f505fc
```

#### Response:

```json
200 OK

{
    "_id": "5e93368821e33e29d8f505fc",
    "title": "Refs and the DOM – React",
    "url": "https://reactjs.org/docs/refs-and-the-dom.html",
    "createdAt": "2020-04-12T15:40:56.809Z",
    "updatedAt": "2020-04-12T15:40:56.809Z"
}
```

### POST /api

Use this endpoint to create a new `URL` object.
The `title` field is required and must be at most 32 characters long.
The `url` field is required and must be a reachable URL.

#### Request:

```json
POST /api

{
    "title": "Eloquent JavaScript",
    "url": "https://eloquentjavascript.net/"
}
```

#### Response:

```json
200 OK

{
    "_id": "5e94f6d700b19d3a3c8457bc",
    "title": "Eloquent JavaScript",
    "url": "https://eloquentjavascript.net/",
    "createdAt": "2020-04-13T23:33:43.551Z",
    "updatedAt": "2020-04-13T23:33:43.551Z"
}
```

### PATCH /api/:id

Use this endpoint to modify an existing `URL` object with the supplied `id` parameter.
If included, the `title` must be at most 32 characters long, the `url` must be a reachable URL.

#### Request:

```json
PATCH /api/5e94f6d700b19d3a3c8457bc

{
    "title": "A great JavaScript book"
}
```

#### Response:

```json
200 OK

{
    "_id": "5e94f6d700b19d3a3c8457bc",
    "title": "A great JavaScript book",
    "url": "https://eloquentjavascript.net/",
    "createdAt": "2020-04-13T23:33:43.551Z",
    "updatedAt": "2020-04-13T23:54:22.787Z"
}
```

### DELETE /api/:id

Use this endpoint to delete an `URL` object with the supplied `id` parameter.

#### Request:

```json
DELETE /api/5e94f6d700b19d3a3c8457bc
```

#### Response:

```json
200 OK

{
    "_id": "5e94f6d700b19d3a3c8457bc",
    "title": "A great JavaScript book",
    "url": "https://eloquentjavascript.net/",
    "createdAt": "2020-04-13T23:33:43.551Z",
    "updatedAt": "2020-04-13T23:54:22.787Z"
}
```

## /token

The `/token` endpoint requires a valid `refreshToken` cookie to be sent with the request.

### GET /token

Use this endpoint to fetch a new `accessToken`.

#### Request:

```json
GET /token

{}
```

#### Response:

```json
200 OK

{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTk0ZWU1NDAwYjE5ZDNhM2M4NDU3YmIiLCJpYXQiOjE1ODY4MjM0ODIsImV4cCI6MTU4NjgyMzU0Mn0.vb54OTZGkZdudQJ2_0MmqV26-KbLUwqCLjoR_0jEpPE"
}
```
