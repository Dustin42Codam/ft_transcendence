#!/bin/bash

EXIT_CODE=0

curl localhost:8082 &>/dev/null

exit $?