# Frontend_in_a_Box (FIaB)
### Development setup (for front end)

FIaB is a starter kit for front end development, using Gulp and a selection of predefined tasks and tools, unifying front end development, structure, files- and assets handling, in web development.

### Requirements
Node must be installed.

### Getting started
Install dependencies: Open the terminal and type
<pre>cd /the/path/to/your/project</pre>
<pre>npm install</pre>   

*Note:* Don't use 'sudo'. If you get access errors trye to fix the acces on the ~/.npm instead, to avoid it in the future:
<pre>sudo chown -R $(whoami) ~/.npm</pre>

#### Install

Install dependencies with :
1. Open the terminal and
2. <pre>cd /the/path/to/your/project</pre>
3. <pre>npm install</pre>

Note: Don’t use ‘sudo’. If you get access errors try to fix the access on the ~/.npm instead, to avoid it in the future:
<pre>sudo chown -R $(whoami) ~/.npm</pre>

#### Setup
In the file “gulpconfig.js” you’ll find the project settings, but FIaB will be ready-to-run for stand-alone-projects.

## Tasks

### Build tasks
Build and watch i the default task
<pre>gulp</pre>

Build only (if used with the --product flag it will ad hash-parameter in the html-files)
<pre>gulp build </pre>
<pre>gulp build --production</pre>

### Dev tasks
Development this runs a sequence of taskse, dev-build, dev-watch and browser-sync on localhost:3000 
<pre>gulp dev</pre>

### Files tasks
<pre>gulp imagemin</pre> (compress (and move) your graphics and images)
<pre>gulp iconfont</pre> (build you icon font)

### Clean tasks
Used in the other tasks for cleaning old versions of the files.
<pre>gulp clean-assets</pre>
<pre>gulp clean-js</pre>
<pre>gulp clean-style</pre>

## React

### Want to use React?
1. Install these modules:
<pre>npm install --save babel-preset-react react react-dom</pre>
2. Add "react" to your .babelrc file
```javascript
{
  "presets": ["es2015", "react"]
}
```
3. Import and use like react examples

```javascript
import ReactDOM from 'react-dom';
import React from 'react'

ReactDOM.render(
  <div>Hello, world!</div>,
  document.getElementById('root')
);
```

