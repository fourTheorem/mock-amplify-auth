const cryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

const STORAGE_KEY = "mock-amplify-auth.state";

let authState;

try {
  authState = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {};
} catch (err) {
  authState = {};
}

Auth = {
  signUp,
  signIn,
  currentSession,
  confirmSignUp,
  signOut,
  resendSignUp
};

function signUp(email) {
  updateState({ email, loggedIn: false });
  return timerPromise(1200);
}

function signIn(email) {
  updateState({ email, session: createSession({ email }), loggedIn: true });
  return timerPromise(700);
}

function currentSession() {
  return timerPromise(400, !!authState.loggedIn, authState.session);
}

function confirmSignUp() {
  return timerPromise(400);
}

function signOut() {
  updateState({ email: null, loggedIn: false, session: null });
  return timerPromise(100);
}

function resendSignUp() {
  return timerPromise(100);
}

function updateState(newState) {
  Object.assign(authState, newState);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
}

function timerPromise(ms, success = true, arg) {
  if (!success && !arg) {
    arg = new Error();
  }
  return new Promise((resolve, reject) =>
    setTimeout(() => (success ? resolve : reject)(arg), ms)
  );
}

function createSession({ email }) {
  const timeS = Math.floor(Date.now() / 1000);
  const cognitoUsername = `mock-auth-${cryptoJs.MD5(email)}`;
  const idTokenPayload = {
    sub: cognitoUsername,
    token_use: "id",
    email_verified: true,
    aud: "mock-auth",
    auth_time: timeS,
    iat: timeS,
    exp: timeS + 100000,
    iss: "https://cognito-idp.local.amazonaws.com/local_mock-auth",
    "cognito:username": cognitoUsername,
    email
  };
  const idToken = {
    jwtToken: jwt.sign(idTokenPayload, "mock-auth-secret"),
    payload: idTokenPayload
  };

  return {
    idToken,
    clockDrift: 0
  };
}
module.exports = Auth;
