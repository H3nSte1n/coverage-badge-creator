<h1>Coverage Badge Creator</h1>  
<br>

![](https://img.shields.io/badge/Coverage-98%25-83A603.svg?prefix=$coverage$)
![CI][ci]
![Build][build]
![Code-Style][code-style]

[![MIT License][license-shield]][license-url]
[![Release][release-shield]][release-url]
![Maintenance][maintained-shield]
<br><br>

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#installation">Installation</a>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li>
      <a href="#config">Config</a>
      <ul>
        <li><a href="#coverage-file-path">Coverage file path</a></li>
        <li><a href="#badges">Badges</a></li>
        <li><a href="#extended">Extended</a></li>
      </ul>
    </li>
    <li><a href="#requirements">Requirements</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



## About The Project
Coverage Badge Creator is a super easy to use tool for your project. It creates badges based on your test coverage and inserts them into the README. All without any third-party libraries or tools.


## Installation
```sh
   npm install --save-dev coverage-badge-creator
```


## Usage

1. First you need to set up your test environment.   

    * jest   
    
      > In jest config you need to add 'json-summary' to coverageReporters. https://jestjs.io/docs/en/configuration  

    * mocha
      ```sh
      {
        "test": "nyc --reporter=json-summary mocha"
      }
      ```
      
      <br>
2. Insert one of the following keys anywhere in your README. These will be replaced by the coverage-badge-creator with the appropriate badge.

    The following keys are available:
     * $coverage$
     * $statements$
     * $branches$
     * $functions$
     * $lines$
 
    _important are also the surrounding dollar signs_  
    
    <br>
 3. Now you can create the badges in two ways.
 
    Create badge from the CLI:
    ```sh
        npm run coverage-badge-creator
    ```
    
    Or add it to your package.json scripts:
    ```sh
    "scripts": {
      "coverage:badge": "coverage-badge-creator",
    }   
    ```
    

## Config
There are various ways to configure the badges according to your wishes. To do this, you only need to create a new file called **.badge-config**. Then you have the following options:   

_For a simple example click [here](https://github.com/H3nSte1n/coverage-badge-creator/blob/main/.conversion-badge-config)._

### coverage file path
```
{
  coverage_file_path: './coverage/json-summary.json'
}
```

### badges
```
 {
   badges: {
     coverage: {
      logo: 'foo'
      color: 'bar'
     }
   }
 }
```
**Depending on your test tool, you will probably have the following badges available for configuration:**
 * coverage
 * statements
 * branches
 * functions
 * lines
 
 **Options**
 * style  
 ![plastic][style-plastic] ![flat][style-flat] ![flat-square][style-flat-square] ![flat-for-the-badge][style-for-the-badge] ![social][style-social]
 * logo  
  ![kotlin][logo-kotlin] ![medium][logo-medium] ![github][logo-github]
 * logoColor  
 ![blue][logo-blue] ![green][logo-green] ![white][logo-black]
 * color  
  ![blue][color-blue] ![green][color-green] ![white][color-black]
 * link  
  ![blue][link-github] ![green][link-medium] ![white][link-reddit]
 
 _For more information on all options, see -> ![](https://img.shields.io/badge/Shields.io-informational?style=for-the-badge&logo=Shields.io&logoColor=white&color=black&link=https://shields.io/)_

### Extended
**In addition, you have further options in the cli.**

* --config
  > This allows you to change the path and name of the configuration file.

  ```sh
  "scripts": {
    "coverage:badge": "coverage-badge-creator --config './badge-coverage-config.json'",
  }
  ```

## Requirements
* Node > v10.0.0


## Built With
This section lists all programming languages and main frameworks.
* [Node](https://nodejs.org/en/)
* [Typescript](https://www.typescriptlang.org/)
* [Jest](https://jestjs.io/)


## Contributing
Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/new_feature`)
3. Commit your Changes (`git commit -m 'feat: Add new feature'`)
4. Push to the Branch (`git push origin feature/new_feature`)
5. Open a Pull Request


## License
Distributed under the MIT License. See `LICENSE` for more information.


## Contact
This npm package is primarily the work of [Henry Steinhauer (H3nSte1n)](https://github.com/H3nSte1n), for full list of contributors see the [contributors graph](https://github.com/H3nSte1n/coverage-badge-creator/graphs/contributors).


## Acknowledgements
* [Img Shields](https://shields.io)
* [README Template](https://github.com/othneildrew/Best-README-Template/blob/master/README.md)





<!--shield-styles-->
[style-plastic]: https://img.shields.io/badge/plastic-83A603.svg?style=plastic
[style-flat]: https://img.shields.io/badge/flat-83A603.svg?style=flat
[style-flat-square]: https://img.shields.io/badge/flat_square-83A603.svg?style=flat-square
[style-for-the-badge]: https://img.shields.io/badge/for_the_badge-83A603.svg?style=for-the-badge
[style-social]: https://img.shields.io/badge/social-83A603.svg?style=social

[logo-github]: https://img.shields.io/badge/logo-github.svg?logo=github
[logo-kotlin]: https://img.shields.io/badge/logo-kotlin.svg?logo=kotlin
[logo-medium]: https://img.shields.io/badge/logo-medium.svg?logo=medium

[logo-blue]: https://img.shields.io/badge/blue-83A603.svg?logo=github&logoColor=blue
[logo-green]: https://img.shields.io/badge/green-83A603.svg?logo=kotlin&logoColor=green
[logo-black]: https://img.shields.io/badge/black-83A603.svg?logo=medium&logoColor=black

[color-blue]: https://img.shields.io/badge/blue-83A603.svg?color=blue
[color-green]: https://img.shields.io/badge/green-83A603.svg?green=green
[color-black]: https://img.shields.io/badge/black-83A603.svg?color=black

[link-github]: https://img.shields.io/badge/Github-83A603.svg?link=https://github.com/
[link-medium]: https://img.shields.io/badge/Medium-83A603.svg?link=https://medium.com/
[link-reddit]: https://img.shields.io/badge/Reddit-83A603.svg?link=https://www.reddit.com/

<!--infos-->
[ci]: https://github.com/H3nSte1n/coverage-badge-creator/workflows/CI/badge.svg?style=flat
[build]: https://github.com/H3nSte1n/coverage-badge-creator/workflows/Build/badge.svg?style=flat
[code-style]: https://github.com/H3nSte1n/coverage-badge-creator/workflows/Code-Style/badge.svg?style=flat
[maintained-shield]: https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=flat
[release-shield]: https://img.shields.io/github/release/H3nSte1n/coverage-badge-creator.svg?style=flat
[release-url]: https://GitHub.com/H3nSte1n/coverage-badge-creator/releases/
[issues-shield]: https://img.shields.io/github/issues/H3nSte1n/coverage-badge-creator.svg?style=flat
[issues-url]: https://github.com/H3nSte1n/coverage-badge-creator/issues
[license-shield]: https://img.shields.io/badge/License-MIT-yellow.svg?style=flat
[license-url]: https://github.com/H3nSte1n/coverage-badge-creator/blob/master/LICENSE
