# Dvhb Webpack with zero initial configuration

## Features

- Webpack
- Babel, ES2015 + modules, Stage 0 preset
- Optional static views with pug template engine (for static websites)

## Install in existing project

```bash
npm install --save-dev @dvhb/webpack
```

Add scripts to package.json

```bash
"scripts": {
  ...
  "start": "dvhb-webpack server",
  "build": "dvhb-webpack build"
  ...
}
```

See basic starter project for more details [examples/basic](https://github.com/dvhbru/webpack/tree/master/examples/basic).

## Workflow

- Add code to `src/`.
- Build and watch changes in `src/` with `npm start`
- Open [localhost:3000](http://localhost:3000)

## Requirements

- Node.js v5+ and npm
