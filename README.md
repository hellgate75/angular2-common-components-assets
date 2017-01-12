<p align="center">
  <img src="/src/assets/logos/angular.png" alt="Angular2 Simple Router Navigation App" width="100" height="100"/>
</p>

# Angular2 Common Components Library Assets

> An Angular2 Common Components Library Assets by [Fabrizio Torelli](https://github.com/hellgate75)

This repo contains all styles, themes, assets, scripts and more used by the Angular 2 Common Components Library. 


## Get started

Sequence of software installation as prerequisite of the assets project :

> Install Ruby [Download Ruby](https://www.ruby-lang.org/en/downloads/)

> Install Sass ```gem install sass```

> Install Sass ```gem install compass```

> Install Susy ```gem install susy```

> Install Sass Globbing ```gem install sass-globbing```

> Install CSS parser ``` gem install css_parser```


## To build as first time

Run

``` npm run-script build```

This will run the npm install and gulp build


## To get sass stats

Run
 
``` npm run-script style-stats```

This will run the compass stats on the project folder and it will return the use of sass elements per output file


## To build and watch changes

Run
 
``` npm run-script style-watch```

This will run the compass watch on the project config


## To update build of distribution

Run

``` npm run-script only-build```

This will run the compass watch on the project config


## Project scructure
* Source in : **src**
* Ruby compass config: **config.rb**
* Bower config: **bower.json** and **.bowerrc**
* Gupl task config: **gulpfile.js**
* Distribution: **dist**

In the source:
* **assets** : pure asset components (svg, video, etc...)
* **images** : images (gif, jpeg, png, etc...)
* **scripts** : javascript source folder
* **styles** : scss file structure (the main is **main.scss**)
* **unbounded** : bower unbounded framework (javascripts, stylesheets and themes)
* **vendor** : bower created vendor folder


## License
 [MIT](/LICENSE.md)
