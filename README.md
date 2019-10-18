# Concerto UI Library

This library providers web UI components for models written in the [Concerto Modeling Language](https://github.com/accordproject/concerto).

[![Coverage Status](https://coveralls.io/repos/github/accordproject/concerto-ui/badge.svg?branch=master)](https://coveralls.io/github/accordproject/concerto-ui?branch=master) [![GitHub license](https://img.shields.io/github/license/accordproject/concerto-ui)](https://github.com/accordproject/concerto-ui/blob/master/LICENSE) [![join slack](https://img.shields.io/badge/Accord%20Project-Join%20Slack-blue)](https://accord-project-slack-signup.herokuapp.com/) [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Build Status](https://travis-ci.org/accordproject/concerto-ui.svg?branch=master)](https://travis-ci.org/accordproject/concerto-ui)

The Concerto Modeling Language is an object-oriented data description (schema) language, based on a textual domain-specific language.

## How this project is structured

Packages: 
- `concerto-ui-core`, includes the base visitor class and utility functions
- `concerto-ui-react`, extends the base visitor to provide a ReactJS form
- `concerto-ui-demo`, uses the react visitor and applies SemanticUI styling

### More Information

Concerto Modeling Language | https://github.com/accordproject/concerto

## What does this do

- **Web-form Generator:** A functional dynamic web component, that generates a web-form based on the fully-qualified name of a type from a Concerto Model. A sample web application that shows the dynamic web component in action.

- Ask a question on [Stack Overflow](http://stackoverflow.com/questions/tagged/accordproject)

## Getting started

If not already installed, install lerna

```
npm i -g lerna
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

---

<a href="https://www.accordproject.org/">
  <img src="assets/APLogo.png" alt="Accord Project Logo" width="400" />
</a>

Accord Project is an open source, non-profit, initiative working to transform contract management and contract automation by digitizing contracts. Accord Project operates under the umbrella of the [Linux Foundation][linuxfound]. The technical charter for the Accord Project can be found [here][charter].

## Learn More About Accord Project

### Overview
* [Accord Project][apmain]
* [Accord Project News][apnews]
* [Accord Project Blog][apblog]
* [Accord Project Slack][apslack]
* [Accord Project Technical Documentation][apdoc]
* [Accord Project GitHub][apgit]


### Documentation
* [Getting Started with Accord Project][docwelcome]
* [Concepts and High-level Architecture][dochighlevel]
* [How to use the Cicero Templating System][doccicero]
* [How to Author Accord Project Templates][docstudio]
* [Ergo Language Guide][docergo]

## Contributing

The Accord Project technology is being developed as open source. All the software packages are being actively maintained on GitHub and we encourage organizations and individuals to contribute requirements, documentation, issues, new templates, and code.

Find out what’s coming on our [blog][apblog].

Join the Accord Project Technology Working Group [Slack channel][apslack] to get involved!

For code contributions, read our [CONTRIBUTING guide][contributing] and information for [DEVELOPERS][developers].

## License <a name="license"></a>

Accord Project source code files are made available under the [Apache License, Version 2.0][apache].
Accord Project documentation files are made available under the [Creative Commons Attribution 4.0 International License][creativecommons] (CC-BY-4.0).

Copyright 2018-2019 Clause, Inc. All trademarks are the property of their respective owners. See [LF Projects Trademark Policy](https://lfprojects.org/policies/trademark-policy/).

[apmain]: https://accordproject.org/ 
[apworkgroup]: https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=MjZvYzIzZHVrYnI1aDVzbjZnMHJqYmtwaGlfMjAxNzExMTVUMjEwMDAwWiBkYW5AY2xhdXNlLmlv&tmsrc=dan%40clause.io
[apblog]: https://medium.com/@accordhq
[apnews]: https://www.accordproject.org/news/
[apgit]:  https://github.com/accordproject/
[apdoc]: https://docs.accordproject.org/
[apslack]: https://accord-project-slack-signup.herokuapp.com

[docspec]: https://docs.accordproject.org/docs/spec-overview.html
[docwelcome]: https://docs.accordproject.org/docs/accordproject.html
[dochighlevel]: https://docs.accordproject.org/docs/spec-concepts.html
[docergo]: https://docs.accordproject.org/docs/logic-ergo.html
[docstart]: https://docs.accordproject.org/docs/accordproject.html
[doccicero]: https://docs.accordproject.org/docs/basic-use.html
[docstudio]: https://docs.accordproject.org/docs/advanced-latedelivery.html

[contributing]: https://github.com/accordproject/concerto-ui/blob/master/CONTRIBUTING.md
[developers]: https://github.com/accordproject/concerto-ui/blob/master/DEVELOPERS.md

[linuxfound]: https://www.linuxfoundation.org
[charter]: https://github.com/accordproject/concerto-ui/blob/master/CHARTER.md
[npmpkg]: https://www.npmjs.com/package/@accordproject/ergo-cli
[coq]: https://coq.inria.fr
[OCaml]: https://ocaml.org
[Qcert]: https://querycert.github.io
[REPL]: https://ergorepl.netlify.com
[studio]: https://studio.accordproject.org
[nodejs]: https://nodejs.org/

[apache]: https://github.com/accordproject/concerto-ui/blob/master/LICENSE
[creativecommons]: http://creativecommons.org/licenses/by/4.0/
