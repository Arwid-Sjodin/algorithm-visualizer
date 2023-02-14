
# Algorithm Visualizer
A React app for visualizing pathfinding and sorting algorithms. 


## Table of contents

- [Algorithm Visualizer](#algorithm-visualizer)
  - [Table of contents](#table-of-contents)
  - [Demo](#demo)
  - [Tech Stack](#tech-stack)
  - [Features](#features)
    - [Sort](#sort)
    - [Pathfind](#pathfind)
  - [Run Locally](#run-locally)
  - [License](#license)


## Demo

https://arwid-sjodin.github.io/algorithm-visualizer/

## Tech Stack
React, JavaScript, HTML, CSS

## Features
### Sort
- Select which algorithm to use.
    - Bubble Sort
    - Insertion Sort
    - Selection Sort
    - Quick Sort (Pivot: First Element)
    - Quick Sort (Pivot: Median of Three)
    - Quick Sort (Pivot: Median of three, cutoff to insertion sort)
    - Merge Sort
    - Heap Sort
- Select how the array should be generated.
  - Shuffled
  - Ascending
  - Descending
  - Realistic (Almost sorted)
- Change the size of the array
- Change the speed of the sorting.


### Pathfind
- Select which algorithm to use.
  - Breadth First Search
  - Depth First Search
  - Dijkstra's
  - A* Search
- Select how the grid should be generated.
  - Empty
  - Maze
- Change the size of the grid.
- Change the speed of the pathfinding.
- Remove cells or place weights. The default weight is 1. Can be changed to a value between 1 and 10 (exclusive).
- Add connected cells (Two cells that are connected with an edge of weight 0 in both directions).
- Drag and drop source, destination and connnected cells to move them to a new position.
If an algorithm is already started, the result is shown immediately when a cell is moved.



## Run Locally
```bash
    git clone
    cd algorithm-visualizer
    npm install --no-save
    npm start
```

## License
[MIT](https://github.com/Arwid-Sjodin/algorithm-visualizer/blob/main/LICENSE)






