[![Build Status](https://travis-ci.org/innowatio/iwwa-front.svg?branch=master)](https://travis-ci.org/innowatio/iwwa-front)
[![Dependency Status](https://david-dm.org/innowatio/iwwa-front.svg)](https://david-dm.org/innowatio/iwwa-front)
[![devDependency Status](https://david-dm.org/innowatio/iwwa-front/dev-status.svg)](https://david-dm.org/innowatio/iwwa-front#info=devDependencies)

# iwwa-frontend

## Development environment setup

After cloning the repository, run `npm install` to install all dependencies, and
`npm run dev` to start the development server.

To run the development server with custom environment variables use

```sh
env VARIABLE="" npm run dev
```

**N.B.** Frontend application need backend service ([`iwwa-back`]
    (https://github.com/innowatio/iwwa-back)) running on local 3000 port.

## Production environment setup

For the production setup, are read the environment variables prefixed by
__APP_CONFIG__ file when `NODE_ENV=production` (see
    [sd-builder](https://git.io/vr1Bf)).
