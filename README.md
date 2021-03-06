# website for flowgallery.js #

## dependencies ##

Node is needed to run build tasks. For running simple tasks Jake is used (https://github.com/mde/jake) - similar to Rake or Make. So make sure the Jake module is installed:

<pre>
npm install jake -g
</pre>

The actual flowgallery.js library (http://github.com/bozz/flowgallery) is included as a git submodule, run the following to checkout the repo:

<pre>
git submodule init
git submodule update
</pre>

## development ##

The website is mainly a single page site - with the exception that additional demos are loaded through ajax. A very simple include mechanism is used to separate out parts of the page during development. Actual development should happen on the files in the "_partials" directory (and NOT on index.html directly!), these are then "compiled" together with a build task (see below) to generate the "index.html". This will allow different build targets for development and production.

## build tasks ##

There are currently two tasks available:

@jake@ - this will update index.html with latest version of files in _partial directory
@jake prod@ - this will create the production version of site in "_release" folder (with minified assets)
@jake server@ - local server on port 8080, that allows loading the demos with ajax

## todos ##

Some things that are still missing:

* more demos
* add watcher for file changes in _partials directory, to regenerate index.html automatically (while server running)
* build task for creating separate single page demos (from fragments in "demos" folder) to be distributed with flowgallery.js download package
