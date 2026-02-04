# WordHunt Solver

A simple C++ program that finds valid words on a 4×4 letter board using a Trie and depth-first search.

## What it does

* Loads a dictionary into a Trie
* Searches the board in all 8 directions
* Avoids reusing tiles in the same word
* Uses prefix pruning to speed things up
* Prints the longest words found first

## How to build

```bash
make
```

## How to run

Provide a 16-letter board as a single string (row-major order):

```bash
./wordhunt abcdefghijklmnop
```

Example (conceptual board):

```
a b c d
e f g h
i j k l
m n o p
```

## Files

* `Trie.h / Trie.cpp` — prefix tree for fast word lookup
* `Board.h / Board.cpp` — board representation + DFS solver
* `main.cpp` — loads the dictionary and runs the solver
* `Words.txt` — dictionary

## Notes

* Only words of length ≥ 3 are considered.
* Each word is reported at most once, even if it can be formed in multiple ways.

## Possible improvements

* Support a special “QU” tile
* Pretty-print the board
* Limit output to top N words
* Show the path used to form each word
