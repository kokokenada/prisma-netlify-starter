#!/bin/bash

export NETLIFY_BUILD_LIFECYCLE_TRIAL=enabled=true;
echo "set-env.sh: NETLIFY_BUILD_LIFECYCLE_TRIAL=$NETLIFY_BUILD_LIFECYCLE_TRIAL"

if [ "$NODE_ENV" == "" ]; then
  export USE_NODE_ENV=production
else
  export USE_NODE_ENV=$NODE_ENV
fi
echo "set-env.sh: NODE_ENV=$NODE_ENV"
echo "set-env.sh: USE_NODE_ENV=$USE_NODE_ENV"

if [ "$USE_NODE_ENV" == "development" ]; then
  echo 'set-env.sh: running export $(xargs <.env.development)'
  export $(xargs <.env.development)
fi

if [ "$BRANCH" != "" ]; then
  export USE_BRANCH=$BRANCH
else
  export USE_BRANCH=`git symbolic-ref --short HEAD`
  if [ "$USE_BRANCH" == "" ]; then
    echo "set-env.sh: Cannot determine branch to set schema"
    exit 1
  fi
fi
echo "set-env.sh: USE_BRANCH=$USE_BRANCH"

if [ "$POSTGRES_USER" != "" ]; then
  export USE_POSTGRES_USER=$POSTGRES_USER
else
  export USE_POSTGRES_USER=postgres
fi
echo "set-env.sh: USE_POSTGRES_USER=$USE_POSTGRES_USER"

if [ "$POSTGRES_PASSWORD_PROD" != "" ] && [ "$BRANCH" == "master" ] ; then
  export USE_POSTGRES_PASSWORD=$POSTGRES_PASSWORD_PROD
elif [ "$POSTGRES_PASSWORD" != "" ] ; then
  export USE_POSTGRES_PASSWORD=$POSTGRES_PASSWORD
else
  export USE_POSTGRES_PASSWORD=postgres
fi
echo "set-env.sh: USE_POSTGRES_PASSWORD=********"

if [ "$POSTGRES_SERVER_PROD" != "" ] && [ "$BRANCH" == "master" ] ; then
  export USE_POSTGRES_SERVER=$POSTGRES_SERVER_PROD
elif [ "$POSTGRES_SERVER" != "" ]; then
  export USE_POSTGRES_SERVER=$POSTGRES_SERVER
else
  export USE_POSTGRES_SERVER=localhost
fi
echo "set-env.sh: USE_POSTGRES_SERVER=$USE_POSTGRES_SERVER"

if [ "$POSTGRES_PORT" != "" ]; then
  export USE_POSTGRES_PORT=$POSTGRES_PORT
else
  export USE_POSTGRES_PORT=5445
fi
echo "set-env.sh: USE_POSTGRES_PORT=$USE_POSTGRES_PORT"

export POSTGRES_URL=postgresql://$USE_POSTGRES_USER:$USE_POSTGRES_PASSWORD@$USE_POSTGRES_SERVER:$USE_POSTGRES_PORT/prisma2b?schema=$USE_BRANCH'&sslaccept=accept_invalid_certs'
# exposes PWD echo "set-env.sh: POSTGRES_URL=$POSTGRES_URL"
