#!/bin/bash

cleanup() {
    echo "Running cleanup"
    npm stop
}

trap 'cleanup' SIGTERM

"${@}" &

wait $!
