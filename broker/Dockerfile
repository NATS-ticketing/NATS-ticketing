FROM nats

EXPOSE 4222 6222 8222 443

# Copy the configuration file
COPY --chown=nats:nats nats-server.conf /etc/nats/nats-server.conf

# Start the NATS server
CMD ["-c", "/etc/nats/nats-server.conf"]
