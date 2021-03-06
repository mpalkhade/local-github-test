#! /bin/bash

echo "Installing serverless"
echo "====================="
npm install serverless

echo "**********Deploying app to $env ************"
echo "====================="
serverless deploy --stage $env --package $CODEBUILD_SRC_DIR/artifacts/$env -v
