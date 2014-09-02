#!/bin/bash
#set -x

function log {
  echo "*** $1"
}

function ruby_environment {
  check_rvm && \
  check_ruby && \
  check_bundler
}

function load_rvm {
  [[ -s ~/.rvm/scripts/rvm ]] && . ~/.rvm/scripts/rvm
}

function install_rvm {
  log "installing rvm"
  bash < <(curl -s https://raw.github.com/wayneeseguin/rvm/master/binscripts/rvm-installer)
  echo 'export rvm_project_rvmrc=1' >> $HOME/.rvmrc
  load_rvm
}

function check_rvm {
  load_rvm
  hash rvm || install_rvm
  log "rvm installed"
}

function set_java_home {
  if [[ `uname` == 'Darwin' ]]; then
    export JAVA_HOME=/System/Library/Frameworks/JavaVM.framework/Home
  fi
  if [[ `uname` == 'Linux' ]]; then
    export JAVA_HOME=/usr/lib/jvm/java-6-sun
  fi
}

function fix_rvm_readline_for_macos_tiger {
  if [[ `uname` == 'Darwin' ]] && [[ `uname -r` == 11* ]]; then
    (cd "$HOME/.rvm/src/readline-6.0" && \
      sed -i "" -e"s/darwin\[89\]\*\|darwin10\*/darwin\[89\]\*\|darwin1\[01\]\*/g" support/shobj-conf && \
      ./configure --prefix="$HOME/.rvm/usr/" && \
      make clean && \
      make && \
      make install)
  fi
}

function install_ruby {
  log "installing ruby"
  rvm pkg install libxml2 --verify-downloads 1 && \
  rvm pkg install openssl && \
  rvm pkg install ncurses --verify-downloads 1 && \
  rvm pkg install readline && \
  fix_rvm_readline_for_macos_tiger && \
  install_xslt && \
  rvm install ruby-1.8.7-p352 -C "--with-readline-dir=$HOME/.rvm/usr --with-xml-dir=$HOME/.rvm/usr --with-openssl-dir=$HOME/.rvm/usr --with-xslt-dir=$HOME/.rvm/usr" && \
  rvm use 1.8.7-p352 && \
  rvm gemset create home-ideas && \
  rvm use 1.8.7-p352@home-ideas
}

function check_ruby {
  rvm list | grep 1.8.7-p352 > /dev/null || install_ruby
  rvm use 1.8.7-p352@home-ideas
  log "ruby installed"
}

function install_bundler {
  log "installing bundler"
  gem sources | grep "http://rubygems.org/" || gem sources -a http://rubygems.org/ && \
  gem sources | grep "http://gems.rubyforge.org/" || gem sources -a http://gems.rubyforge.org/ && \
  gem sources | grep "http://dist.dev.int.realestate.com.au/rubygems/" || gem sources -a http://dist.dev.int.realestate.com.au/rubygems/ && \
  gem install bundler --no-ri --no-rdoc
}

function install_rea_env {
  gem install rea-env --no-ri --no-rdoc --source=http://dist.dev.int.realestate.com.au/rubygems/
}

function check_bundler {
  which bundle | grep 1.8.7-p352 > /dev/null || install_bundler
  log "bundler installed"
}

function install_xslt {
  [[ -d "$HOME/.rvm/usr/include/libxslt" ]] || \
    ( cd /tmp && \
    rm -rf libxslt-1.1.26 && \
    wget -c ftp://xmlsoft.org/libxml2/libxslt-1.1.26.tar.gz && \
    tar -zxvf libxslt-1.1.26.tar.gz && \
    cd libxslt-1.1.26 && \
    ./configure --prefix="$HOME/.rvm/usr" --with-libxml-prefix="$HOME/.rvm/usr" && \
    make && \
    make install )
}

function install_bundle {
  hash rvm 2>&1 > /dev/null || gem install bundler
  log "install bundle"
  fix_nokogiri
  bundle install && \
  fix_rjb && \
  log "bundle installed"
}

function fix_rjb {
  if [[ `uname` == 'Darwin' ]]; then
    gem list rjb | grep universal-darwin > /dev/null && gem uninstall rjb -a --ignore-dependencies
    gem list rjb | grep 1.3.3 > /dev/null || gem install rjb --platform=ruby --version=1.3.3
  fi
}

function fix_nokogiri {
  #gem uninstall nokogiri -aIx
  gem list nokogiri | grep 1.4.7 > /dev/null || gem install --version=1.4.7 nokogiri -- --with-xslt-dir="$HOME/.rvm/usr"
}

function acceptance_app {
  export HI_AD_SWITCH=false &&
  log "running app tests"
  bundle exec buildr \
    clean \
    config:generate \
    artifacts \
    checkstyle \
    db:reset \
    cobertura:html \
    hi:domain:cobertura:check \
    hi:producer:cobertura:check \
    hi:app:cobertura:check \
    hi:publisher:cobertura:check \
    jslint \
    jasmine:ci \
    hi:app:package \
    hi:app:acceptance \
    hi:app:acceptance_wip
}

function acceptance_publisher {
    export HI_AD_SWITCH=false &&
    export HI_ENV=standalone &&
    log "running publisher tests"
    bundle exec buildr \
    clean \
    config:generate \
    hi:publisher:package \
    hi:publisher:acceptance \
    hi:publisher:acceptance_wip \
    test=no
}

function acceptance_tests {
  export HI_AD_SWITCH=false &&
  log "running acceptance tests"
  bundle exec buildr \
    clean \
    config:generate \
    artifacts \
    checkstyle \
    db:reset \
    cobertura:html \
    hi:domain:cobertura:check \
    hi:producer:cobertura:check \
    hi:app:cobertura:check \
    hi:publisher:cobertura:check \
    jslint \
    jasmine:ci \
    hi:app:package \
    hi:app:acceptance \
    hi:app:acceptance_wip &&
  bundle exec buildr \
    hi:publisher:package \
    hi:publisher:acceptance \
    hi:publisher:acceptance_wip
}

function app_acceptance_tests {
  log "running app acceptance tests"
  bundle exec buildr \
    clean \
    config:generate \
    artifacts \
    checkstyle \
    db:reset \
    cobertura:html \
    hi:domain:cobertura:check \
    hi:producer:cobertura:check \
    hi:app:cobertura:check \
    jslint \
    jasmine:ci \
    hi:app:package \
    hi:app:acceptance \
    hi:app:acceptance_wip
}

function acceptance_only_ad {
  export HI_AD_SWITCH=true &&
  log "running app ad tests"
  ruby_environment && \
  install_bundle && \
  bundle exec buildr test=no\
    clean \
    config:generate \
    hi:app:package \
    hi:app:acceptance_only_ad
}

function acceptance_only_login {
  export HI_ENV=local_social &&
  log "running tests need login"
  ruby_environment && \
  install_bundle && \
  bundle exec buildr test=no\
    clean \
    config:generate \
    hi:app:package \
    hi:app:acceptance_only_login
}

function publisher_acceptance_tests {
  log "running acceptance tests"
  bundle exec buildr \
    clean \
    config:generate \
    artifacts \
    checkstyle \
    db:reset \
    cobertura:html \
    hi:domain:cobertura:check \
    hi:publisher:cobertura:check \
    hi:publisher:package \
    hi:publisher:acceptance \
    hi:publisher:acceptance_wip
}

function deploy_verification_tests {
  log "running deploy verification tests"
  bundle exec buildr \
    hi:app:deploy_verification
}

function package {
  ruby_environment && \
  install_bundle && \
  log "running unit tests" && \
  bundle exec buildr \
    artifacts \
    clean \
    config:generate \
    checkstyle \
    db:reset \
    cobertura:html \
    hi:domain:cobertura:check \
    hi:producer:cobertura:check \
    hi:app:cobertura:check \
    hi:publisher:cobertura:check \
    jslint \
    jasmine:ci && \
  log "packaging" && \
  bundle exec buildr \
    hi:app:package \
    hi:publisher:package \
    package:package \
    deploy:generate_production_deployment_artifacts && \
  package_hi_deploy
}

function package_without_test {
  ruby_environment && \
  install_bundle && \
  bundle exec buildr test=no \
    clean \
    hi:app:package \
    hi:publisher:package \
    package:package \
    deploy:generate_staging_jsons \
    deploy:generate_production_deployment_artifacts
}

function publish {
  ruby_environment && \
  install_bundle && \
  bundle exec buildr package:publish && \
  publish_hi_deploy
}

function deploy {
  ruby_environment && \
  install_bundle && \
  bundle exec buildr package:deploy
}

function pre_commit {
  JAVA_OPTS="-XX:MaxPermSize=512M -XX:PermSize=512M" \
  ruby_environment && \
  install_bundle && \
  acceptance_app && \
  acceptance_only_login && \
  acceptance_publisher && \
  acceptance_only_ad
}

function clean {
  ruby_environment && \
  install_bundle && \
  bundle exec buildr clean
  clean_hi_deploy
}

function acceptance_standalone {
  ruby_environment && \
  install_bundle && \
  bundle exec buildr test=no\
    config:generate \
    package:extract_app \
    hi:app:acceptance \
    hi:app:acceptance_wip \
    package:extract_publisher \
    hi:publisher:acceptance \
    hi:publisher:acceptance_wip
}

function acceptance_standaloneA {
  ruby_environment && \
  install_bundle && \
  bundle exec buildr test=no\
    config:generate \
    package:extract_app \
    hi:app:acceptance_jobA
}

function acceptance_standaloneB {
  ruby_environment && \
  install_bundle && \
  bundle exec buildr test=no\
    config:generate \
    package:extract_app \
    hi:app:acceptance_jobB \
    hi:app:acceptance_wip \
    package:extract_publisher \
    hi:publisher:acceptance \
    hi:publisher:acceptance_wip
}

function acceptance_standalone1 {
  ruby_environment && \
  install_bundle && \
  bundle exec buildr test=no\
    config:generate \
    package:extract_app \
    db:reset \
    hi:app:acceptance_job1 \
    hi:app:acceptance_wip \
    package:extract_publisher \
    hi:publisher:acceptance \
    hi:publisher:acceptance_wip
}

function acceptance_standalone2 {
  ruby_environment && \
  install_bundle && \
  bundle exec buildr test=no\
    config:generate \
    package:extract_app \
    db:reset \
    hi:app:acceptance_job2
}

function acceptance_standalone3 {
  ruby_environment && \
  install_bundle && \
  bundle exec buildr test=no\
    config:generate \
    package:extract_app \
    db:reset \
    hi:app:acceptance_job3
}

function acceptance_standalone4 {
  ruby_environment && \
  install_bundle && \
  bundle exec buildr test=no\
    config:generate \
    package:extract_app \
    db:reset \
    hi:app:acceptance_job4
}

function acceptance_standalone_ad {
  ruby_environment && \
  install_bundle && \
  bundle exec buildr test=no\
    config:generate \
    package:extract_app \
    db:reset \
    hi:app:acceptance_ad
}

function app_acceptance_ci {
  ruby_environment && \
  install_bundle && \
  app_acceptance_tests
}

function publisher_acceptance_ci {
  ruby_environment && \
  install_bundle && \
  publisher_acceptance_tests
}

function commit {
  JAVA_OPTS="-XX:MaxPermSize=512M -XX:PermSize=512M" \
  ruby_environment && \
  bundle exec buildr git:commit git:pull && \
  pre_commit && \
  git push
}

function integration_tests {
  ruby_environment && \
  install_bundle && \
  bundle exec buildr test=no\
    clean \
    config:generate \
    artifacts \
    db:reset \
    db:load_fixtures \
    hi:app:package \
    hi:app:jetty-deploy-with-real-fast \
    hi:publisher:package \
    hi:publisher:jetty-deploy-with-real-fast \
    hi:integration-test
}

function local_app_publisher_with_fast {
   bundle exec buildr test=no\
    clean \
    config:generate \
    artifacts \
    db:reset \
    db:load_fixtures \
    hi:app:package \
    hi:app:jetty-deploy-with-real-fast \
    hi:publisher:package \
    hi:publisher:jetty-deploy-with-real-fast \
    hi:jetty-wait
}

function integration_tests_staging {
  ruby_environment && \
  install_bundle && \
  bundle exec buildr \
    db:reset \
    db:load_fixtures \
    hi:integration-test-staging
}

function integration_tests_for_staging {
  ruby_environment && \
  install_bundle && \
  bundle exec buildr \
    db:reset \
    db:load_fixtures \
    hi:integration_test_staging$1
}

function performance {
  ruby_environment && \
  install_bundle && \
  bundle exec buildr \
  config:generate \
  jmeter:run
}

function deploy_task {
  task=$1
  env=$2
  version=$3

  (rvm use ruby-1.8.7-p352@home-ideas-deployment-script && \
  cd deployment-script && \
  bundle exec ./bin/hi-deploy-ec2 --task $task --subdomain $env --build-number $version)
}

function check_rea_ec2_env {
    ruby_environment && \
    (cd deployment-script && \
    rvm use --create ruby-1.8.7-p352@home-ideas-deployment-script && \
    check_bundler && \
    install_bundle)
}

function package_hi_deploy {
    check_rea_ec2_env
    (rvm use ruby-1.8.7-p352@home-ideas-deployment-script && \
        cd deployment-script && \
        rake package)
}

function publish_hi_deploy {
    check_rea_ec2_env
    (rvm use ruby-1.8.7-p352@home-ideas-deployment-script && \
        cd deployment-script && \
        rake publish)
}

function clean_hi_deploy {
    check_rea_ec2_env
    (rvm use ruby-1.8.7-p352@home-ideas-deployment-script && \
        cd deployment-script && \
        rake clean)
}

function wait_for_jobs {
    for pid in `jobs -p`; do
        wait $pid || ((exit_status++))
    done

    echo "all working process exit with status $exit_status"
}

function provision_env {
    env=$1
    version=$2

    check_rea_ec2_env

    deploy_task fast_single_create $env $version &
    deploy_task store_create $env $version &
    deploy_task publisher_create $env $version &
    deploy_task app_create $env $version &

    exit_status=0
    wait_for_jobs
    exit $exit_status
}

function start_node {
    node_name=$1
    env=$2

    rvm use ruby-1.8.7-p352@home-ideas-deployment-script && \
    cd deployment-script && \
    rea-ec2-start-instance $node_name.$env
}

function provision_app_and_publisher_also_start_store_and_fast {
    env=$1
    version=$2

    check_rea_ec2_env

    start_node "hidb01" $env &
    start_node "hidb02" $env &
    start_node "hifastadm01" $env &
    deploy_task publisher_create $env $version &
    deploy_task app_create $env $version &

    exit_status=0
    wait_for_jobs
    exit $exit_status
}

function provision_app_publisher_and_store {
    env=$1
    version=$2

    check_rea_ec2_env

    start_node "hifastadm01" $env &
    deploy_task store_create $env $version &
    deploy_task publisher_create $env $version &
    deploy_task app_create $env $version &

    exit_status=0
    wait_for_jobs
    exit $exit_status
}

function provision_staging_env {
  staging_env="hi-staging-$1"
  provision_app_and_publisher_also_start_store_and_fast $staging_env $GO_PIPELINE_COUNTER
}

function local_app {
  bundle exec buildr clean test=no\
    config:generate \
    hi:app:package \
    hi:app:go
}

function local_app_with_social {
  bundle exec buildr clean test=no\
    config:generate \
    hi:app:package \
    hi:app:social_go
}

function local_publisher {
  bundle exec buildr clean test=no \
    config:generate \
    hi:publisher:package \
    hi:publisher:go
}

function local_publisher_jetty {
  bundle exec buildr clean test=no \
    config:generate \
    hi:publisher:package \
    hi:publisher:jetty
}

function local_app_with_fast {
  bundle exec buildr test=no clean \
    config:generate \
    hi:app:package \
    hi:app:real_go
}

function ec2_for_build {
  ec2_environments hi-ci hi-staging hi-staging-2
}

function all_ec2_environments {
  ec2_environments hi-ci hi-qa hi-qa-simon hi-showcase hi-staging hi-staging-2 hi-temp hi-e2e hi-qa-e2e
}

function ec2_environments {
  mkdir -p ec2
  for i in "$@"; do
    if [ -d "ec2/$i" ]; then
      (cd "ec2/$i" && git pull origin master)
    else
      (cd ec2 && git clone "git@git.realestate.com.au:deployment-environments/$i.git")
    fi
  done
}

function provision_image_server_node {
    check_rea_ec2_env

    start_node images hi-ci
}

function provision_wordpress_node {
    check_rea_ec2_env

    start_node wordpress hi-ci
}

function transfer {
    scp tmp/rhel/rea/noarch/*.rpm root@go:/var/lib/go-agent/pipelines/home-ideas/home-ideas/tmp/rhel/rea/noarch/ && \
    scp tmp/rhel/rea/noarch/*.rpm root@go2:/var/lib/go-agent/pipelines/home-ideas/home-ideas/tmp/rhel/rea/noarch/
}

function fake_tagging_provider {
    ruby_environment && \
    install_bundle && \
    bundle exec buildr tagging_provider:start
}

function run_app_cucumber_with_specific_tag {
   bundle exec buildr test=no\
    clean \
    config:generate \
    artifacts \
    db:reset \
    db:load_fixtures \
    hi:app:package \
    hi:app:jetty-deploy-with-fake-fast \
    hi:tests_with_tag[$1]
}

function run_publisher_cucumber_with_specific_tag {
   bundle exec buildr test=no\
    clean \
    config:generate \
    artifacts \
    db:reset \
    db:load_fixtures \
    hi:publisher:package \
    hi:publisher:jetty-deploy-with-real-fast \
    hi:tests_with_tag[$1]
}

function analyse_app_cucumber_time_by_tag {
    for i in "$@"; do
    run_app_cucumber_with_specific_tag $i > test && \
    echo $i >> analyse && \
    cat test | grep Completed >> analyse
    done
}

function analyse_publisher_cucumber_time_by_tag {
    for i in "$@"; do
    run_publisher_cucumber_with_specific_tag $i > test && \
    echo $i >> analyse && \
    cat test | grep Completed >> analyse
    done
}

function analyse_cucumber_time {
    analyse_cucumber_time_by_tag @advertisement @email @error_page @page_heading @image_dispatch @seo @diagnostics @recommendations @detail @most_popular @refine_search @sitemap
    analyse_publisher_cucumber_time_by_tag @image_fetcher @popularity @admin_console @tag_fetcher
}

function start_local_wordpress {
    check_vm_gemset && \
    vagrant up wordpress
}

function start_vm_ie8 {
    check_vm_gemset && \
    vagrant up ie8
}

function start_vm_ie9 {
    check_vm_gemset && \
    vagrant up ie9
}

function stop_local_wordpress {
    check_vm_gemset && \
    vagrant halt wordpress
}

function check_vm_gemset {
    cd virtual_machines && \
    rvm use --create ruby-1.8.7-p352@vms && \
    bundle install
}

function local_social {
    HI_ENV=local_social ./build.sh local_app_with_social
}

function local_qa {
    HI_ENV=local_db_uat_fast ./build.sh local_app_with_fast
}

function show_help {
  echo "Usage: build.sh [COMMAND]"
  echo ""
  echo "COMMAND:"
  echo -e "  clean: \t\tclean everthing."
  echo -e "  pre_commit: \t\tcheck the environment and run unit tests & all acceptance tests."
  echo -e "  commit: \t\tcommit to local repo, and pull from remote repo, and then run all acceptance tests and push to remote repo."
  echo -e "  ruby_environment: \tcheck rvm, ruby and bundle. install them if not exist."
  echo -e "  install_bundle: \tuse 'bundle install' to install missing gems."
  echo -e "  acceptance_tests: \tunit test and static check, then run all the acceptance tests."
  echo -e "  acceptance_standalone: unit test and static check, then run all the acceptance tests in a standalone env."
  echo -e "  integration_tests: \tintegration tests on local machine, with a real fast server."
  echo -e "  integration_tests_staging: integration tests in staging env, with a real fast server, hi-store, hi-publisher and hi-app on tomcat."
  echo -e "  ec2: \t\t\tclone/pull the homeideas rea-env ec2 environments."
  echo -e "  package: \t\tpackage all components, and generate json files"
  echo -e "  publish: \t\tpublish artifacts from ci to dist"
  echo -e "  deploy: \t\tpublish production.txt from ci to dist"
  echo -e "  provision: \t\tprovision env with cap script, param 1: env name, param 2: go pipeline count"
  echo -e "  provision_app_and_publisher: \t\tprovision app and publisher only"
  echo -e "  local_app: \t\tgenerate the configuration, compile code to package and start the local jetty server."
  echo -e "  local_social: \t\tlocal jetty server with facebook configuration"
  echo -e "  local_qa: \t\tlocal jetty server with hifastadm01 in hi-qa environment configuration"
  echo -e "  start_vm_ie8: \tstart local virtual machine windows xp with IE8 browser"
  echo -e "  start_vm_ie9: \tstart local virtual machine windows 7 with IE9 browser"
}

function main {
  set_java_home && \
  case $1 in
    clean) clean ;;
    ruby_environment) ruby_environment ;;
    install_bundle) install_bundle ;;
    pre_commit) pre_commit ;;
    acceptance_tests) acceptance_tests ;;
    package) package ;;
    package_without_test) package_without_test ;;
    publish) publish ;;
    deploy) deploy ;;
    app_acceptance_ci) app_acceptance_ci ;;
    publisher_acceptance_ci) publisher_acceptance_ci ;;
    commit) commit ;;
    fix_rjb) fix_rjb ;;
    acceptance_standalone) acceptance_standalone ;;
    acceptance_only_ad) acceptance_only_ad;;
    acceptance_standaloneA) acceptance_standaloneA ;;
    acceptance_standaloneB) acceptance_standaloneB ;;
    acceptance_standalone1) acceptance_standalone1 ;;
    acceptance_standalone2) acceptance_standalone2 ;;
    acceptance_standalone3) acceptance_standalone3 ;;
    acceptance_standalone4) acceptance_standalone4 ;;
    acceptance_standalone_ad) acceptance_standalone_ad;;
    integration_tests) integration_tests ;;
    integration_tests_staging) integration_tests_staging ;;
    integration_tests_for_staging) integration_tests_for_staging $2 ;;
    performance) performance ;;
    provision_staging_env) provision_staging_env $2;;
    local_app) local_app ;;
    local_publisher) local_publisher ;;
    local_pub) local_publisher_jetty ;;
    local_app_with_fast) local_app_with_fast ;;
    local_app_with_social) local_app_with_social ;;
    local_social) local_social ;;
    local_qa) local_qa ;;
    ec2) ec2_for_build ;;
    ec2_all) all_ec2_environments ;;
    provision_image_server_node) provision_image_server_node ;;
    provision_wordpress_node) provision_wordpress_node ;;
    transfer) transfer ;;
    local_app_publisher_with_fast) local_app_publisher_with_fast ;;
    dvt) deploy_verification_tests;;
    fake_tagging_provider) fake_tagging_provider;;
    tests_with_tag) run_app_cucumber_with_specific_tag $2;;
    analyse_cucumber_time) analyse_cucumber_time ;;
    provision) provision_env $2 $3;;
    provision_app_and_publisher) provision_app_and_publisher_also_start_store_and_fast $2 $3;;
    start_local_wordpress) start_local_wordpress ;;
    stop_local_wordpress) stop_local_wordpress ;;
    start_vm_ie8) start_vm_ie8 ;;
    start_vm_ie9) start_vm_ie9 ;;
    package_hi_deploy) package_hi_deploy ;;
    acceptance_only_login) acceptance_only_login ;;
    acceptance_publisher) acceptance_publisher;;
    *) show_help && exit 1 ;;
  esac
}

main $@

