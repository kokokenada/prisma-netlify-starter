#!/bin/bash

#will exit if any of the commands fail
set -e

. ./set-env.sh

if [ "$USE_NODE_ENV" == "development" ]; then
  # Generate GraphQL schema from Nexus definitions
  echo "graphql-build.sh: generating graphql schema and types (./src-graphql/schema.graphql and ./src-graphql/generated-types.d.ts)"
  npx ts-node -D 2339 -D 2307 src-graphql/types/generate.ts src.js
  echo "graphql-build.sh: done generating graphql schema and types"

  # Generate types from GQL queries
  echo "graphql-build.sh: generate types from GQL queries (./src/lib/gql-types.ts)"
#  npx apollo codegen:generate --localSchemaFile='src-graphql/schema.graphql' --target=typescript --includes='src/**/*.ts' --clientName=clientName --outputFlat src/lib/gql-types.ts
  echo "graphql-build.sh: done generate types from GQL queries"
fi

# Build Lambda
mkdir -p lambda/

if [ "$USE_NODE_ENV" == "development" ]; then
  echo "graphql-build.sh: running 'tsc --project ./src-graphql --outDir ./lambda/' to compile graphql API into lambda function"
  npx tsc --project ./src-graphql --outDir ./lambda/ #netlify dev will check folders whereas netlify-lambda serve does not
  echo "graphql-build.sh: running 'tsc --project ./src-graphql --outDir ./lambda/' completed OK"

  echo "graphql-build.sh: copying generated files to lambda directory"
  cp -R ./src-graphql/generated ./lambda
  echo "graphql-build.sh: done copying generated files to lambda directory"

else
  # Build Lambda in different directory for Netlify zip-it-and-ship-it
  echo "graphql-build.sh: running 'tsc --project ./src-graphql --outDir ./lambda/graphql' to compile graphql API into lambda function"
  npx tsc --project ./src-graphql --outDir ./lambda/graphql/ #everything needs to be in folder for zip-it or else certain dependencies lost
  echo "graphql-build.sh: 'tsc --project ./src-graphql --outDir ./lambda/graphql' completed OK"

  echo "graphql-build.sh: copying generated files to lambda directory"
  cp -R ./src-graphql/generated ./lambda/graphql
  echo "graphql-build.sh: done copying generated files to lambda directory"
fi

if [ "$BUILD_NODE_SERVER" == "yes" ]; then
  # Build Node App - this is to experiment with NOT using Lambda and use a Node instance/container instead
  # Once built, use node graphqql-dist/server.js to run the server. Seemed to work just fine at time of writing
  echo "graphql-build.sh: running tsc compile graphql API into graphql-dist function"
  cd src-graphql; npx tsc; cd ..;
  echo "graphql-build.sh: tsc completed OK"

  echo "graphql-build.sh: copying generated files to graphql-dist directory"
  cp -R ./src-graphql/generated ./graphql-dist
  echo "graphql-build.sh: done copying generated files to graphql-dist directory"
fi

echo "graphql-build.sh: find lambda -print"
find lambda -print

echo "graphql-build.sh: du -m lambda"
du -m lambda

#echo "graphql-build.sh: prisma -print"
#find prisma -print
