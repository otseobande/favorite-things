#!/bin/bash

echo ${env_file} | base64 -d > .env

zappa update
