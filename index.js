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

function signUp({ email }) {
  updateState({ email, loggedIn: false });
  return timerPromise(1200);
}

function signIn({ email }) {
  updateState({ email, loggedIn: true });
  return timerPromise(700);
}

function currentSession() {
  return timerPromise(400, !!authState.loggedIn);
}

function confirmSignUp() {
  return timerPromise(400);
}

function signOut() {
  updateState({ email: null, loggedIn: false });
  return timerPromise(100);
}

function resendSignUp() {
  return timerPromise(100);
}

function updateState(newState) {
  Object.assign(authState, newState);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
}

function timerPromise(ms, success = true) {
  return new Promise((resolve, reject) =>
    setTimeout(
      () =>
        (success ? resolve : reject)({
          source: "mock-amplify-auth"
        }),
      ms
    )
  );
}

module.exports = Auth;
