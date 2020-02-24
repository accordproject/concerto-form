# Concerto UI Library

This library providers web UI components for models written in the [Concerto Modeling Language](https://github.com/accordproject/concerto).

[![Coverage Status](https://coveralls.io/repos/github/accordproject/concerto-ui/badge.svg?branch=master)](https://coveralls.io/github/accordproject/concerto-ui?branch=master) [![GitHub license](https://img.shields.io/github/license/accordproject/concerto-ui)](https://github.com/accordproject/concerto-ui/blob/master/LICENSE) [![join slack](https://img.shields.io/badge/Accord%20Project-Join%20Slack-blue)](https://accord-project-slack-signup.herokuapp.com/) [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Build Status](https://travis-ci.org/accordproject/concerto-ui.svg?branch=master)](https://travis-ci.org/accordproject/concerto-ui)

The Concerto Modeling Language is an object-oriented data description (schema) language, based on a textual domain-specific language.

## How this project is structured

Packages: 
- `concerto-ui-core`, includes the base visitor class and utility functions
- `concerto-ui-react`, extends the base visitor to provide a ReactJS form
- `concerto-ui-react-demo`, demo for Concerto UI

### More Information

Concerto Modeling Language | https://github.com/accordproject/concerto

## What does this do

- **Web-form Generator:** A functional dynamic web component, that generates a web-form based on the fully-qualified name of a type from a Concerto Model. A sample web application that shows the dynamic web component in action.

- Ask a question on [Stack Overflow](http://stackoverflow.com/questions/tagged/accordproject)

## Getting started

If not already installed, install lerna

```
npm install -g lerna
```

Install all of the project's dependencies and build each of the components

```
lerna bootstrap
npm run build
```

Run the demo app and experiment with the form generator

```
npm run demo:react
```

Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

