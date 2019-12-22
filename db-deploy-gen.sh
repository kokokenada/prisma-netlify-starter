#!/bin/bash

. ./set-env.sh

#will exit if any of the commands fail
set -e

echo "db-deploy-gen.sh: running 'prisma2 lift up' to install tables"
cd prisma
npx prisma2 lift up --create-db --verbose --auto-approve
cd ..
echo "db-deploy-gen.sh: 'prisma2 lift up' completed OK"

if [ "$USE_NODE_ENV" == "production" ]; then
  # and make URL a literal because Netlify won't set environment variables
  echo "db-deploy-gen.sh: writing POSTGRES_URL into prisma.schema file"
  # https://unix.stackexchange.com/questions/32907/what-characters-do-i-need-to-escape-when-using-sed-in-a-sh-script
  sed 's/env("POSTGRES_URL")'/\"`echo $POSTGRES_URL | sed s/\\\\//\\\\\\\\\\\\//g | sed s/\\&/\\\\\\\\\\\\\&/g`\"/g prisma/schema.prisma | sed 's/"native", //'> prisma/schema.prisma.new
  cp prisma/schema.prisma.new prisma/schema.prisma
fi

echo "db-deploy-gen.sh: running 'prisma2 generate' to generate database interface"
npx prisma2 generate #places generated files in ./graphql/generated in develop
echo "db-deploy-gen.sh: prisma2 generate completed OK"
