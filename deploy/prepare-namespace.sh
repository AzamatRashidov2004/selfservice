#!/bin/sh

if [ -z "$1" ]; then
  echo "missing namespace as argument"
  exit 1
else
  if [ $(kubectl get ns -o name | grep -c $1) -eq 0 ]; then
    echo "creating namespace $1"
    kubectl create ns $1
    # kubectl -n $1 create secret generic alquist --from-file=app.local.properties=$APPCONFIG
    # kubectl -n $1 create secret generic google-sa --from-file=key.json=$GOOGLESA
  else
    echo "namespace $1 exists"
  fi

  # helm3 -n $1 repo add promethistai https://repository.flowstorm.ai/helm
  # helm3 -n $1 repo update
fi
