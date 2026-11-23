\# Rate Limiting Project



A distributed rate limiting application built using Node.js, Express.js, and Redis.



\## Overview



This project implements rate limiting middleware to control the number of requests users can make within a specific time window.



Redis is used to store request counters, allowing multiple server instances to share rate limit data.



\## Technologies Used



\- Node.js

\- Express.js

\- Redis

\- ioredis

\- dotenv



\## Features



\- IP-based login rate limiting.

\- User-based transfer rate limiting.

\- Separate limits for read-only routes.

\- Redis-based request counters.

\- Atomic request counting using Redis Lua scripts.

\- HTTP 429 response when the request limit is exceeded.

\- Retry-After response header.



\## Installation



Clone the repository:



```bash

git clone https://github.com/Archanachaurasiya30/ratelimit.git

```



Navigate to the project directory:



```bash

cd ratelimit

```



Install dependencies:



```bash

npm install

```



\## Redis Configuration



Make sure Redis is running locally.



The application uses the following default Redis URL:



```text

redis://127.0.0.1:6379

```



You can configure a different Redis URL using an environment variable:



```text

REDIS\_URL=redis://127.0.0.1:6379

```



\## Running the Application



Start the server:



```bash

npm start

```



The server runs on port 3000 by default.



You can change the port using the PORT environment variable.



\## API Endpoints



| Method | Endpoint | Rate Limit |

|---|---|---|

| POST | /login | 5 requests per minute per IP |

| POST | /transfer | 10 requests per minute per user |

| GET | /balance | 100 requests per minute per user |



\## Rate Limit Responses



When the request limit is exceeded, the server returns HTTP 429.



Example:



```json

{

&#x20; "error": "Too many requests",

&#x20; "retryAfterSeconds": 60,

&#x20; "message": "Try again in 60 seconds."

}

```



Response headers:



\- X-RateLimit-Limit

\- X-RateLimit-Remaining

\- Retry-After (when the limit is exceeded)



\## Testing



The project includes two test scripts.



Login rate limit test:



```bash

node test.js

```



Transfer rate limit test:



```bash

node test-transfer.js

```



Both test scripts alternate between ports 3000 and 3001. Therefore, run two server instances before executing them.



\## Important Note



The transfer and balance routes currently use the `x-user-id` request header for identifying users.



In a production application, this should be replaced with a trusted authenticated user ID from authentication middleware.



\## License



ISC

