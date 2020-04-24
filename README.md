### atxmon ###
[![Build Status](https://travis-ci.com/Altronix/atxmon.svg?branch=master)](https://travis-ci.com/Altronix/atxmon)
[![codecov](https://codecov.io/gh/Altronix/atxmon/branch/master/graph/badge.svg)](https://codecov.io/gh/Altronix/atxmon)

### Quickstart ###

```
npm install
npm run start -- --httpPort 3333
```

### Test ###

```
npm run test

npm run coverage
```

### Build docker container ###

```
npm run build:docker
```


### Run docker container ###

```
npm run start:docker  -- --name=foobar --httpPort=9000 --zmtpPort=8444

npm run stop:docker -- --name=foobar

```
