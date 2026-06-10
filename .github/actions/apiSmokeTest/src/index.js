import * as core from "@actions/core";
import fs from "node:fs";

// find the first URL
const urlRegex = /https:.*/
// Assume that the APIKey's name begins with TempAPIKey and then take the string after that name
const keyRegex = /(?<=TempApiKey.* )[^ ]*/

function hasValue(candidate) {
    if (candidate && candidate.length > 0) {
        return candidate;
    } else {
        return null;
    }
}

async function smokeTest() {
    // get inputs
    const query = core.getInput("query");
    const workingDir = core.getInput("working-directory");
    const altUrl = hasValue(core.getInput("url"));
    const expectedRegex = new RegExp(core.getInput("expected-regex"));

    // open deploy.out and extract API URL and API key
    const path = !workingDir || workingDir == '.' || workingDir == '' ? '' : '/' + workingDir;
    const data = fs.readFileSync(process.cwd() + path + '/deploy.out', 'utf8');
    if (!hasValue(data)) {
        core.error("Failed to read deploy.out");
    }
    const urlMatch = data.match(urlRegex);
    let url = altUrl || (urlMatch && urlMatch[0]);
    if (!hasValue(url)) {
        core.setFailed("Could not extract API URL from deployment output");
        return;
    }

    // Try TempApiKey regex in deploy.out first (legacy serverless apiGateway.apiKeys).
    // Fall back to the `legacy-api-key` input — used when the deploy stack has
    // moved past TempApiKey (e.g. JWT authorizer with x-api-key compatibility).
    const keyMatch = data.match(keyRegex);
    const legacyApiKey = hasValue(core.getInput("legacy-api-key"));
    let key = (keyMatch && keyMatch[0]) || legacyApiKey;

    if (!hasValue(key)) {
        core.setFailed(
            "Could not extract API key: no `TempApiKey` line in deploy.out and " +
            "no `legacy-api-key` input provided."
        );
        return;
    }
    if (!keyMatch && legacyApiKey) {
        core.info("Using `legacy-api-key` input (no TempApiKey in deploy.out)");
    }

    if (url.endsWith("{any+}")) {
        core.info("Url needs to be adjusted: " + url);
        url = url.replace("{any+}", "graphql");
    }

    // Mask the key in any subsequent log output (defence-in-depth — the value
    // should already be coming from a secret, but ::add-mask is free insurance).
    core.setSecret(key);
    core.info("URL: " + url);
    core.info("Key: <masked>");
    core.info("Query: " + query);

    // send sample query to the API
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-api-key": key
        },
        body: JSON.stringify({ query })
    })

    // This can happen if starting up the API takes longer, for example if we use a Docker image.
    if (response.status == 504) {
        core.info("Gateway timeout, will try again");
        response = await fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "x-api-key": key
            },
            body: JSON.stringify({ query })
        })
    }

    const result = await response.text()

    if (!response.ok) {
        core.setFailed(`Smoke test response: ${response.status}, ${result}`);
        return;
    }
    core.info("Response: " + result)

    const resultJson = JSON.parse(result);
    if (resultJson.errors) {
        core.setFailed("API response contains error");
    }

    // check if response matches the expected regex
    if (result.match(expectedRegex)) {
        core.info("Matches: " + expectedRegex);
    } else {
        core.error("Does not match " + expectedRegex);
        core.setFailed("Smoke test does not return expected result");
    }

}

try {
    await smokeTest();
} catch (error) {
    core.info(error);
    core.setFailed("Smoke test failed: " + error.message);
}
