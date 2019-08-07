#!/bin/bash

echo ${env_file} | base64 -d > .env

find . -name '*.pyc' -delete

rm -rf htmlcov .coverage ./client/coverage

pip uninstall -y codecov coverage django-nose pytest

pip freeze > requirements.txt

zappa update
