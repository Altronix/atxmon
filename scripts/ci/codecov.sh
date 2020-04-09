#!/bin/bash
bash <(curl -s https://codecov.io/bash) -f ./coverage/lcov.info;
