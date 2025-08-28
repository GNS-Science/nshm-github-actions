import sys
# import os

# for name, value in os.environ.items():
#     print("{0}: {1}".format(name, value))

stage = sys.argv[2]
region = sys.argv[4]

if stage != "prod" and stage != "test":
    print("unexpected stage: " + stage)
    sys.exit(1)

if region != "ap-southeast-2":
    print("unexpected region: " + region)
    sys.exit(1)

print(

    """> nshm-model-graphql-api@0.3.0 deploy
> serverless deploy --stage 


api keys:
  TempApiKey-nzshm22-model-graphql-api-test: the-totally-real-api-key Api key until we have an auth function
endpoints:
  OPTIONS - https://fu7kuwh.execute-api.ap-southeast-2.amazonaws.com/test/graphql
  POST - https://fu7kuwh.execute-api.ap-southeast-2.amazonaws.com/test/graphql
  GET - https://fu7kuwh.execute-api.ap-southeast-2.amazonaws.com/test/graphql
  GET - https://fu7kuwh.execute-api.ap-southeast-2.amazonaws.com/test/graphql/{proxy+}
  GET - https://fu7kuwh.execute-api.ap-southeast-2.amazonaws.com/test/static/{proxy+}
functions:
  app: nzshm22-model-graphql-api-test-app (18 MB)"""
)
