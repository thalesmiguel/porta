FROM quay.io/centos7/ruby-26-centos7

USER root

ENV RUBY_MAJOR_VERSION=2 \
    RUBY_MINOR_VERSION=6

ENV RUBY_VERSION="${RUBY_MAJOR_VERSION}.${RUBY_MINOR_VERSION}" \
    RUBY_SCL_NAME_VERSION="${RUBY_MAJOR_VERSION}${RUBY_MINOR_VERSION}"

ARG BUNDLER_ENV
ENV BUNDLER_ENV="${BUNDLER_ENV}" \
    TZ=:/etc/localtime \
    BUNDLE_GEMFILE=Gemfile \
    BUNDLE_WITHOUT=development:test \
    VARNISH_SCL=rh-varnish5 \
    NODEJS_SCL=rh-nodejs12 \
    RUBY_SCL="rh-ruby${RUBY_SCL_NAME_VERSION}"

WORKDIR /opt/system

RUN yum-config-manager --save --setopt=cbs.centos.org_repos_sclo7-$RUBY_SCL-rh-candidate_x86_64_os_.skip_if_unavailable=true \
    && rpm -Uvh https://download.postgresql.org/pub/repos/yum/reporpms/EL-7-x86_64/pgdg-redhat-repo-latest.noarch.rpm \
    && yum -y update \
    && yum remove -y postgresql \
    && yum -y install centos-release-scl-rh \
              ImageMagick \
              ImageMagick-devel \
              unixODBC-devel \
              mysql \
              postgresql10 postgresql10-devel postgresql10-libs \
              file \
              $NODEJS_SCL \
              $VARNISH_SCL-jemalloc \
    && yum install -y epel-release \
    && yum -y clean all \
    && scl enable $VARNISH_SCL -- printf '$LIBRARY_PATH' | cut -d: -f1 > /etc/ld.so.conf.d/jemalloc.conf \
    && ldconfig && ldconfig -p | grep jemalloc

# Install sphinx search
RUN if [ "`uname -m`" == "x86_64" ]; then \
      yum install -y https://sphinxsearch.com/files/sphinx-2.2.11-1.rhel7.x86_64.rpm ; \
    else \
      curl -sSL http://sphinxsearch.com/files/sphinx-2.2.11-release.tar.gz | tar xz -C /tmp \
      && cd /tmp/sphinx-2.2.11-release && ./configure && make install \
      && rm -rf /tmp/sphinx* ; \
    fi

# We don't want to redo the bundle install step every time a file has changed:
# copying only the gemspec files and copying all the other files after the build
ADD lib/developer_portal/*.gemspec lib/developer_portal/
ADD vendor/active-docs/*.gemspec vendor/active-docs/
ADD Gemfile* ./
ADD Rakefile ./

COPY openshift/system/contrib/scl_enable /opt/app-root/etc/

ENV BASH_ENV=/opt/app-root/etc/scl_enable \
    ENV=/opt/app-root/etc/scl_enable \
    PROMPT_COMMAND=". /opt/app-root/etc/scl_enable" \
    RAILS_ENV=production \
    SAFETY_ASSURED=1

RUN export ${BUNDLER_ENV} >/dev/null\
    && source /opt/app-root/etc/scl_enable \
    && gem install bundler --version 2.2.25 \
    && bundle config build.pg --with-pg-config=/usr/pgsql-10/bin/pg_config \
    && bundle install --deployment --jobs $(grep -c processor /proc/cpuinfo) --retry=5

RUN chgrp root /opt/system/

ADD . ./
ADD config/docker/* ./config/
ADD package.json ./
ADD yarn.lock ./
ADD openshift/system/config/* ./config/

RUN export ${BUNDLER_ENV} >/dev/null \
    && source /opt/app-root/etc/scl_enable \
    && bundle exec rake tmp:create \
    && mkdir -p public/assets db/sphinx \
    && chmod g+w -vfR log tmp public/assets db/sphinx \
    && umask 0002 \
    && cd /opt/system \
    && npm install -g yarn \
    && yarn install:safe --no-progress \
    && SECRET_KEY_BASE=rails/32947 bundle exec rake assets:precompile tmp:clear \
    && rm log/*.log \
    && chmod g+w /opt/system/config

USER 1001
ADD openshift/system/entrypoint.sh /opt/system/entrypoint.sh
EXPOSE 3000 9306
# TODO: dumb-init!
ENTRYPOINT ["/opt/system/entrypoint.sh"]
CMD ["unicorn", "-c", "config/unicorn.rb", "-E", "${RAILS_ENV}", "config.ru"]

# vim: set ft=dockerfile:
