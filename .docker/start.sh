#!/bin/bash

if [ ! -d "node_modules" ] || [ ! -f "yarn.lock" ]; then
  yarn install
fi

tail -f /dev/null