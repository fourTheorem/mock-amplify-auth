"use strict";

const importFresh = require("import-fresh");
const { test } = require("tap");

const store = {};

const localStorage = {
  setItem: (key, value) => {
    store[key] = value;
  },
  getItem: key => {
    return store[key] || null;
  }
};

global.window = {
  localStorage
};

const Auth = require("..");

const email = "test@example.com";

test("logged out by default", t => {
  t.rejects(Auth.currentSession());
  t.end();
});

test("sign up succeeds", async t => {
  await Auth.signUp({ email });
});

test("confirm signup succeeds", async t => {
  await Auth.confirmSignUp();
});

test("resend signup succeeds", async t => {
  await Auth.resendSignUp();
});

test("sign in succeeds", async t => {
  await Auth.signIn(email);
});

test("email address can be extracted from user ID", async t => {
  await Auth.signIn(email);
  const session = await Auth.currentSession();
  const { sub } = session.idToken.payload;
  const extractedEmail = Auth.extractEmail(sub);
  t.equal(extractedEmail, email);
});

test("logged in after sign in", async t => {
  await Auth.currentSession();
});

test("logged in persists on new import", async t => {
  const freshAuth = importFresh("..");
  await freshAuth.currentSession();
});

test("signout succeeds", async t => {
  await Auth.signOut();
});

test("logged out after signout", t => {
  t.rejects(Auth.currentSession());
  t.end();
});

test("reset password updates the email state", async t => {
  await Auth.forgotPassword(email);
  try {
    await Auth.currentSession();
    t.fail(
      "currentSession should have thrown an error when there is no active session"
    );
  } catch (err) {
    // Expected
  }
});

test("forgotPasswordSubmit", async t => {
  await Auth.forgotPasswordSubmit();
});

test("gracefully degrades when local storage item is bad", t => {
  localStorage.setItem("mock-amplify-auth.state", "{{{");
  const freshAuth = importFresh("..");
  t.rejects(freshAuth.currentSession());
  t.end();
});
