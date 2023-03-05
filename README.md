# placementPoint

## How to set up local development
```sh

# Install dependencies
npm i

# Start the app and open it in your browser
npm run dev -- --open
```

## Limitations
 - Can end up in local maximums and miss global maximum.
 - No validation is done on input

I decided to try writing this in javascript. Something I regret in hindsight. I am just not used to it and had to spend a lot of time fighting against the language.

All files were copied from https://github.com/finch3d/finch-assignment-algo except for src/geometryUtils.js and src/getPlacementPoint.js which I wrote.

If I had more time I would want experiment with [Voroni Diagrams](https://en.wikipedia.org/wiki/Voronoi_diagram)
