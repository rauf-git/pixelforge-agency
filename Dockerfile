FROM alpine:latest

# Install minimal certificates and zip utilities
RUN apk add --no-cache ca-certificates unzip wget

ENV PB_VERSION=0.23.5

# Download and extract the official precompiled PocketBase binary
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip \
    && unzip pocketbase_${PB_VERSION}_linux_amd64.zip -d /pb \
    && rm pocketbase_${PB_VERSION}_linux_amd64.zip \
    && chmod +x /pb/pocketbase

# Expose port 8080 to Render's router
EXPOSE 8080

# Run PocketBase, directing data to a persistent path
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080", "--dir=/pb/pb_data"]
