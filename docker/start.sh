#!/bin/bash

start_app(){
	echo "Starting app... $@"
	npm run start -- "$@"
}
start_app $@
