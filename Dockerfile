# Use a lightweight Linux base image
FROM alpine:latest

# Install system dependencies
RUN apk add --no-cache \
    unzip \
    ca-certificates \
    curl

# Specify the PocketBase version
ENV PB_VERSION=0.23.5

# Download and unzip PocketBase for 64-bit Linux AMD64 architecture
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/ && \
    rm /tmp/pb.zip && \
    chmod +x /pb/pocketbase

# Expose port 8080 to the Render network router
EXPOSE 8080

# Start PocketBase, binding to all interfaces and mapping db files to the persistent volume
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080", "--dir=/pb/pb_data"]
