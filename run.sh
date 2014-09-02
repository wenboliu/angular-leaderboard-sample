#!/bin/bash
#set -x
node server.js &
cd mockerserver && node server.js &
