FROM ubuntu

# Install packages
RUN apt-get update && \
    apt-get install -y curl

COPY docker-mapping.sh /

ENTRYPOINT ["/docker-mapping.sh"]