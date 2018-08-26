#!/bin/bash

# Entrypoint script for Dockerfile so it has a chance to turn the lights
# off before shutdown

cleanup() {
    echo "Running cleanup"
    npm stop
}

# Run cleanup function on SIGTERM
trap 'cleanup' SIGTERM

# Run the rest of the agruments (after 1) in the background (&)
"${@}" &

# Wait on the PID of the process just started
wait $!
