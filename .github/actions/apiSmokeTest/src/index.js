import * as core from "@actions/core";
import * as github from "@actions/github";
import fs from "node:fs";

const urlRegex = /https:.*/
const keyRegex = /(?<=TempApiKey.* )[^ ]*/

function hasValue(candidate) {
    if (candidate && candidate.length > 0) {
        return candidate;
    } else {
        return null;
    }
}

try {

    const query = core.getInput("query");
    const workingDir = core.getInput("working-directory");
    const altUrl = hasValue(core.getInput("url"));
    const expectedRegex = new RegExp(core.getInput("expected-regex"));

    // // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context, undefined, 2);
    // core.info(payload)

    const path = !workingDir || workingDir == '.' || workingDir == '' ? '' : '/' + workingDir;

    const data = fs.readFileSync(process.cwd() + path + '/deploy.out', 'utf8');
    const url = altUrl || data.match(urlRegex)[0];
    const key = data.match(keyRegex)[0];

    core.info("URL: " + url);
    core.info("Key: " + key);
    core.info("Query: " + query);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-api-key": key
        },
        body: JSON.stringify({ query })
    })

    if (!response.ok) {
        core.setFailed(`Smoke test response: ${response.status}`);
    }
    const result = await response.text()
    core.info("Response: " + result)

    if (result.match(expectedRegex)) {
        core.info("Matches: " + expectedRegex);
    } else {
        core.error("Does not match " + expectedRegex);
        core.setFailed("Smoke test does not return expected result");
    }
} catch (error) {
    core.setFailed("Smoke test failed: " + error.message);
}
