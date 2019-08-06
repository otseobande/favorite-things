#!/bin/bash

echo ${env_file} | base64 -d > .env

cd ../

find . -name '*.pyc' -delete

rm -rf htmlcov .coverage ./client/coverage

pip uninstall -y codecov

zappa update