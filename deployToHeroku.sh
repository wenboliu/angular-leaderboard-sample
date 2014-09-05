#!/bin/bash
#set -x

git remote add heroku git@heroku.com:leaderboard-angular-sample.git
git rm node_modules
git commit -am 'removing node_modules'
git push -f heroku karma-jasmine:master