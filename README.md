# mock-amplify-auth

A mock implementation of some of the AWS Amplify SDK for Authentication

## Why?

`mock-amplify-auth` is useful for offline testing of Serverless applications using the Amplify SDK for authentication. It avoids having to connect to a real Cognito endpoint.

This module uses Local Storage for persistence of the logged-in state.

## What is supported

Currently, all operations succeed regardless of inputs, so it's pretty much all happy path. It stores whether you are logged in or not.

## Supported APIs

- `signUp`
- `signIn`
- `currentSession`
- `confirmSignUp`
- `signOut`
- `resendSignUp`

## LICENSE

MIT. See [LICENSE](LICENSE)

Copyright fourTheorem Ltd. 2019
