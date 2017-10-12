# CLI commands and options

## `dvhb-webpack init`
Init new project.

## `dvhb-webpack server`
Run dev/prod server.

## `dvhb-webpack build`
Generate a dist bundle for project.

# CLI options

## `--config <file>`
Specify path to the config file.

## `--verbose`
Print debug information.

## `--port`
Server port, default: `3000`.

## `--env`
Environment, default: `development`.

## `--app-env`
Application environment, _experimental option_.

# ENV variables

## `ASSET_PATH="https://mysite.com/folder/"`
Specify webpack publicPath. See [ publicPath docs](https://webpack.js.org/guides/public-path/)
