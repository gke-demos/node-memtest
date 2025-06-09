#!/bin/sh

kubectl patch pod node-memtest --subresource resize --patch \
  '{"spec":{"containers":[{"name":"node-memtest", "resources":{"requests":{"memory":"2G"},"limits":{"memory":"2G"}}}]}}'