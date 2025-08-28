# Smoke Test Action for API Deployments

A GitHub workflow action that extracts access info from the output of the deploy step and sends a sample GraphQL request to the deployed API.

## Inputs

See [action.yml](./action.yml)

## Development

The code for this action is in [./src/index.js](./src/index.js)

Run

```shell
npm install
```

to install the necessary dependencies.


After changing index.js, run

```shell
npm run-script build 
```

Otherwise your changes won't have an effect.

While developing on your branch, go to the [deploy-to-aws.yml workflow](../../workflows/deploy-to-aws.yml) and change the reference to the action:

```yaml
      - name: Smoke Test
        uses: GNS-Science/nshm-github-actions/.github/actions/apiSmokeTest@my-branch-name
        with:
```

Otherwise the workflow will still use the `main` version. Make sure to revert this change when merging your branch.
