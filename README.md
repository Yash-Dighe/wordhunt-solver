# WordHunt Solver

A 4×4 letter-board word finder with a **bubbly, colorful web UI** and a C++ backend that uses a Trie and depth-first search.

## Project layout

* **`frontend/`** — Web UI (HTML, CSS, JS): 4×4 grid, solve button, word list
* **`backend/`** — C++ solver + Node API server
  * `Trie.h` / `Trie.cpp` — prefix tree for fast word lookup
  * `Board.h` / `Board.cpp` — board representation + DFS solver
  * `main.cpp` — CLI entry (loads dictionary, runs solver)
  * `Words.txt` — dictionary (same folder as the executable)
  * `server.js` — HTTP server: serves the frontend and `POST /api/solve`

## Quick start

1. **Build the C++ solver** (from repo root or `backend/`):

   ```bash
   cd backend
   make
   ```

2. **Start the server** (serves frontend + API):

   ```bash
   cd backend
   npm start
   ```

3. Open **http://localhost:3000** in your browser. Enter 16 letters (left-to-right, top-to-bottom), then click **Solve**.

## CLI (optional)

Run the solver from the command line with a 16-letter string:

```bash
cd backend
./wordhunt_solver    # then type 16 letters when prompted
# or
./wordhunt_solver abcdefghijklmnop
```

Board order is row-major (first 4 letters = first row, etc.).

## How it works

* Loads `Words.txt` into a Trie (path is relative to the executable’s working directory).
* Searches the board in all 8 directions with DFS.
* Uses prefix pruning and reports each word once; only words of length ≥ 3.

## Possible improvements

<<<<<<< HEAD
* Add scoring like real Boggle
* Support a special “QU” tile
=======
>>>>>>> ad1d7571451db38b38fed6b819b180a63c3e3d36
* Show the path used to form each word
