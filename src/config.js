const { randomStringGenerator, compact } = require("./utils.js");
const { htmlPage } = require("./html.js");
const { accessSecretVersion } = require("./secrets.js");
const { Firestore } = require("@google-cloud/firestore");

const firestore = new Firestore();

require("dotenv").config();

const database = {
  async get(key) {
    console.log("Getting value:", key);
    const document = firestore.doc(key);
    const snapshot = await document.get();
    return snapshot.data();
  },
  async set(key, value) {
    console.log("Setting value:", key, value);
    const document = firestore.doc(key);
    await document.set(value);
  },
  async delete(key) {
    console.log("Deleting value:", key);
    const document = firestore.doc(key);
    await document.delete();
  },
};

const callbackOptions = {
  success: (installation, installOptions, req, res) => {
    console.log(
      "Success callback for installation:",
      JSON.stringify(installation, null, 2)
    );
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Success! You can close this window.");
  },
  failure: (error, installOptions, req, res) => {
    console.log(
      "Failure callback for installation:",
      JSON.stringify(error, null, 2)
    );
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Failure! You can close this window.");
  },
};

const renderHtmlForInstallPath = (url) => htmlPage(url);

const stateKey = (key) => `state/${key}`;
const installKey = (key) => `install/${key}`;

const stateStore = {
  generateStateParam: async (installUrlOptions, now) => {
    console.log("Generating state param", installUrlOptions, now);
    const state = randomStringGenerator();
    const value = { options: installUrlOptions, now };
    await database.set(stateKey(state), compact(value));
    return state;
  },
  verifyStateParam: async (now, state) => {
    console.log("Verifying state param", now, state);
    const value = await database.get(stateKey(state));
    const generated = new Date(value.now);
    const seconds = Math.floor((now.getTime() - generated.getTime()) / 1000);
    if (seconds > 600) {
      throw new Error("The state expired after 10 minutes!");
    }
    return value.options;
  },
};

const installerOptions = {
  authVersion: "v2",
  directInstall: true,
  installPath: "/slack/install",
  redirectUriPath: "/slack/oauth_redirect",
  stateVerification: "true",
  stateStore,
};

const installationStore = {
  storeInstallation: async (installation) => {
    console.log("Storing installation:", JSON.stringify(installation, null, 2));
    if (
      installation.isEnterpriseInstall &&
      installation.enterprise !== undefined
    ) {
      // support for org wide app installation
      return await database.set(
        installKey(installation.enterprise.id),
        compact(installation)
      );
    }
    if (installation.team !== undefined) {
      // single team app installation
      return await database.set(
        installKey(installation.team.id),
        compact(installation)
      );
    }
    throw new Error("Failed saving installation data to installationStore");
  },
  fetchInstallation: async (installQuery) => {
    console.log("Getting installation:", JSON.stringify(installQuery, null, 2));
    if (
      installQuery.isEnterpriseInstall &&
      installQuery.enterpriseId !== undefined
    ) {
      // org wide app installation lookup
      return await database.get(installKey(installQuery.enterpriseId));
    }
    if (installQuery.teamId !== undefined) {
      // single team app installation lookup
      return await database.get(installKey(installQuery.teamId));
    }
    throw new Error("Failed fetching installation");
  },
  deleteInstallation: async (installQuery) => {
    console.log(
      "Deleting installation:",
      JSON.stringify(installQuery, null, 2)
    );
    // change the line below so it deletes from your database
    if (
      installQuery.isEnterpriseInstall &&
      installQuery.enterpriseId !== undefined
    ) {
      // org wide app installation deletion
      return await database.delete(installKey(installQuery.enterpriseId));
    }
    if (installQuery.teamId !== undefined) {
      // single team app installation deletion
      return await database.delete(installKey(installQuery.teamId));
    }
    throw new Error("Failed to delete installation");
  },
};

// Use the environment variable if it exists, otherwise use the secret manager
const environmentSecret = async (envKey) => {
  const value = process.env[envKey];
  if (value) {
    console.log(`Using ${envKey} from environment variable`, value);
    return value;
  }
  return await accessSecretVersion(envKey);
};

const getConfig = async () => {
  const [clientId, clientSecret, signingSecret, stateSecret] =
    await Promise.all([
      environmentSecret("SLACK_CLIENT_ID"),
      environmentSecret("SLACK_CLIENT_SECRET"),
      environmentSecret("SLACK_SIGNING_SECRET"),
      environmentSecret("SLACK_STATE_SECRET"),
    ]);

  const scopes = ["chat:write", "users:read", "im:write", "commands"];

  return {
    signingSecret,
    clientId,
    clientSecret,
    stateSecret,
    scopes,
    installerOptions,
    installationStore,
  };
};

module.exports = getConfig;
