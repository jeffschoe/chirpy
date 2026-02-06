# Chirpy AI Endpoints

## GET /api/healthz 📍

Health check and readiness.

### Response

- **Status 200 OK**


## GET /admin/metrics 📍

Returns HTML to be rendered in the browser, informing how many times the server has been visited.

### Response

- **Status 200 OK**

```html
<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileServerHits} times!</p>
  </body>
</html>
```


## POST /admin/reset 📍

Resets development data by deleting all users and any associated records (e.g. chirps, refresh tokens) and resetting the hit counter.

### Auth Requirements 

- `.env` must have: `PLATFORM="dev"`

### Response

- **Status 200 OK**

### Errors

- 403 Forbidden - if dev environment not validated


## POST /api/polka/webhooks 📍

Marks a user as a "chirpy red" member (premium, paid feature) when received.

### Auth Requirements 

- `.env` must have: `POLKA_KEY="your_polka_api_key"`

### Request Body

- `event` (string)
- `data.userId` (string)

### Example Request Body

```json
{
  "data": {
    "userId": "user_id"
  },
  "event": "user.upgraded"
}
```

### Response

- **Status 204 NO CONTENT**

### Errors

- 401 Unauthorized - if `POLKA_KEY` cannot be validated
- 404 Not Found - if `userId` could not be found in the database



## POST /api/login 📍

Creates access and refresh tokens for the specified user.

### Request Body

- `password` (string)
- `email` (string)

### Example Request Body

```json
{
  "email": "walt@breakingbad.com",
  "password": "123456"
}
```

### Response

- **Status 200 OK**

```json
{
  "id": "5a47789c-a617-444a-8a80-b50359j47804",
  "createdAt": "2021-07-01T00:00:00Z",
  "updatedAt": "2021-07-01T00:00:00Z",
  "email": "lane@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OkkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMgJf36POk6yJV_adQssw5c",
  "refreshToken": "56aa826d22baab4u5ec2cea41a59ecbba03e542aedbb31d9b80326ac8ffcfa2a"
}
```

### Errors

- 400 Bad Request - if missing `password` or `email` field
- 401 Unauthorized - if `password` or `email` were incorrect or could not be validated, or issue creating refresh token


## POST /api/refresh 📍

Generates a new access token.

### Auth Requirements 

- Must pass an authorization header in the `Authorization: Bearer <refresh_token>` format

### Response

- **Status 200 OK**

```json
{
  "token": "new_access_token"
}
```

### Errors

- 401 Unauthorized - if refresh token passed in the Auth header does not exist, is expired, or has been revoked


## POST /api/revoke 📍

Revokes the refresh token passed in the header.

### Auth Requirements 

- Must pass an authorization header in the `Authorization: Bearer <refresh_token>` format

### Response

- **Status 204 NO CONTENT**


## POST /api/users 📍

Creates a user.

### Request Body

- `password` (string)
- `email` (string)

### Example Request Body

```json
{
  "email": "walt@breakingbad.com",
  "password": "password"
}
```

### Response

- **Status 201 CREATED**

```json
{
  "createdAt": "2026-02-03T17:06:59.565Z",
  "email": "walt@breakingbad.com",
  "id": "6e52bba8-0f7f-4cdc-bfc5-988ddc42842e",
  "isChirpyRed": false,
  "updatedAt": "2026-02-03T17:06:59.565Z"
}
```

### Errors

- 400 Bad Request - if missing `password` or `email` field, or malformed authorization header

## PUT /api/users 📍

Users can update their own email and password.

### Auth Requirements 

- Must pass an authorization header in the `Authorization: Bearer <jwt_access_token>` format

### Request Body

- `password` (string)
- `email` (string)

### Example Request Body

```json
{
  "email": "walt@breakingbad.com",
  "password": "new_password"
}
```

### Response

- **Status 200 OK**

```json
{
  "createdAt": "2026-02-03T16:50:18.434Z",
  "email": "walt@breakingbad.com",
  "id": "1a7y7eef-en8b-43b0-84be-303bcc9cfb6c",
  "isChirpyRed": false,
  "updatedAt": "2026-02-03T21:50:18.649Z"
}
```

### Errors

- 400 Bad Request - if missing `password` or `email` field, or malformed authorization header
- 401 Unauthorized - can occur for various issues with malformed auth header or incorrect information (unable to validate)

## POST /api/chirps 📍

Posts a new chirp.

### Request Body

- `body` (string)

### Example Request Body

```json
{
  "body": "my new chirp, everyone please listen!"
}
```

### Response

- **Status 201 CREATED**

```json
{
  "body": "Darn that fly, I just wanna cook",
  "createdAt": "2026-02-03T17:06:59.684Z",
  "id": "2b5387d7-7c02-4311-89a4-9f3d6075c71d",
  "updatedAt": "2026-02-03T17:06:59.684Z",
  "userId": "6e52bbav-0f9f-4cdc-bfc5-988fd442842e"
}
```

### Errors

- 400 Bad Request - malformed authorization header
- 401 Unauthorized - can occur for various issues with malformed auth header or incorrect information (unable to validate)


## GET /api/chirps📍

Returns chirps filtered and sorted according to the supplied query parameters.

### Query Parameters

- `author_id` (optional, string) – filter chirps by author (matches `userId/user_id` on the chirps table)
- `sort` (optional, string) - sort chirps in ascending or descending order by various fields.
    - `sort=asc` / `sort=desc` → shorthand for `created_at:asc` / `created_at:desc`
    - `sort=created_at:asc` 
    - `sort=created_at:desc`
    - `sort=body:asc`
    - `sort=body:desc`
    - `sort=email:asc`
    - `sort=email:desc`
    - Default: `created_at:asc` if `sort` is not provided.

### Example Requests

GET http://localhost:8080/api/chirps
GET http://localhost:8080/api/chirps?sort=desc
GET http://localhost:8080/api/chirps?sort=body:desc
GET http://localhost:8080/api/chirps?author_id=eff63ae0-9207-4258-ae4d-b278529e60f4
GET http://localhost:8080/api/chirps?sort=body:desc&author_id=eff63ae0-9207-4258-ae4d-b278529e60f4


### Response

- **Status 200 OK**

```json
[
  {
    "body": "I'm the one who knocks!",
    "createdAt": "2026-02-03T17:06:59.671Z",
    "id": "27b62fa4-13a4-4e38-941c-fd408b20e1a5",
    "updatedAt": "2026-02-03T17:06:59.671Z",
    "userId": "6e52bba8-0f9f-4cdc-bfc5-988fdc42842e"
  },
  {
    "body": "Gale!",
    "createdAt": "2026-02-03T17:06:59.677Z",
    "id": "ec25820a-d2a2-4e3e-ada2-9134b490e62b",
    "updatedAt": "2026-02-03T17:06:59.677Z",
    "userId": "6e52bba8-0f9f-4cdc-bfc5-988fdc42842e"
  },
  {
    "body": "Cmon Pinkman",
    "createdAt": "2026-02-03T17:06:59.681Z",
    "id": "24e872fc-17c2-4821-b67d-7d0ad630e9d8",
    "updatedAt": "2026-02-03T17:06:59.681Z",
    "userId": "6e52bba8-0f9f-4cdc-bfc5-988fdc42842e"
  },
  {
    "body": "Darn that fly, I just wanna cook",
    "createdAt": "2026-02-03T17:06:59.684Z",
    "id": "2b5387d7-7c02-4311-89a4-9f3d6075c71d",
    "updatedAt": "2026-02-03T17:06:59.684Z",
    "userId": "6e52bba8-0f9f-4cdc-bfc5-988fdc42842e"
  }
]
```

## GET /api/chirps/:chirpId  📍

Returns the specified chirp.

### Path Parameters

- `chirpId` (string)

### Response

- **Status 200 OK**

```json
{
  "body": "Darn that fly, I just wanna cook",
  "createdAt": "2026-02-03T17:06:59.684Z",
  "id": "2b5387d7-7c02-4311-89a4-9f3d6075c71d",
  "updatedAt": "2026-02-03T17:06:59.684Z",
  "userId": "6e52bba8-0f9f-4cdc-bfc5-988fdc42842e"
}
```

### Errors

- 404 Not Found - if the chirp ID passed could not be found in the database



## DELETE /api/chirps/:chirpId 📍

Deletes a chirp by its ID if the requester is the author of the chirp.

### Auth Requirements 

- Must pass an authorization header in the `Authorization: Bearer <jwt_access_token>` format


### Response

- **Status 204 NO CONTENT**

### Errors

- 400 Bad Request - malformed authorization header
- 401 Unauthorized - can occur for various issues with malformed auth header or incorrect information (unable to validate)
- 403 Forbidden - if the user trying to make the request is not the chirp author
- 404 Not Found - if the chirp ID passed could not be found in the database