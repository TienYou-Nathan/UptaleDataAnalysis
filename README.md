# vrcovid-parcours

UptaleDataAnalysis is a project that aims to provide in-depth individual and group behaviour analysis from [Uptale](https://www.uptale.io/en/home)'s data exports

## Features

- Platform-agnostic
- Client-sided
- Compatible with any Uptale Project

## User Quickstart

- [Open the application](https://tienyou-nathan.github.io/UptaleDataAnalysis/)
- Upload details csv file in the top right corner of the app
- Click on the play button
- Assign groups to users in `Users Setup`
- Assign categories and themes to scenes in `Categories Setup`
- Execute SQL requests in `SQL Playground` (Execute with CTRL+Enter)
- To save changes, download the database with the download button (upper right corner)

## Developper Quickstart

```
git clone https://github.com/TienYou-Nathan/UptaleDataAnalysis
cd UptaleDataAnalysis
npm i
npm run serve
```

## Dependencies

- [VueJS](https://github.com/vuejs/vue)
- [SQL-JS](https://github.com/sql-js/sql.js)
- [Codemirror](https://github.com/codemirror/CodeMirror)

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
