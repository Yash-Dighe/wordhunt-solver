#include "Board.h"
#include <iostream>

int main(){
    std::cout << "Ya Diggy's wordhun't solver n shi.\n\n";
    
    Trie trie;
    Board::loadDictionary("Words.txt", trie);
    
    std::array<std::array<char, 4>, 4> grid;
    std::cout << "\nWhat's the board lookin like twin:\n";
    
    std::string input;
    std::cin >> input;
    
    while (input.length() != 16){
        std::cout << "Bro that is NOT your board.\n";
        std::cin >> input;
    }
    
    int idx = 0;
    for (int i = 0; i < 4; i++){
        for (int j = 0; j < 4; j++){
            grid[i][j] = (char)std::tolower((unsigned char)input[idx++]);

        }
    }
    
    Board board(grid);
    heap words = board.findWords(trie);
    
    std::cout << "Aight now go win:\n\n";
    while (!words.empty()){
        std::cout << words.top() << "\n";
        words.pop();
    }
    
    return 0;
}
