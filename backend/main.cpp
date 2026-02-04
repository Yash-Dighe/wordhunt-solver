#include "Board.h"
#include <iostream>
#include <string>
#include <cctype>

int main(int argc, char* argv[]){
    Trie trie;
    Board::loadDictionary("Words.txt", trie);
    
    std::string input;
    if (argc >= 2 && std::string(argv[1]).length() == 16){
        input = argv[1];
        for (char& ch : input) ch = (char)std::tolower((unsigned char)ch);
    } else {
        std::cin >> input;
        while (input.length() != 16){
            std::cout << "Board must be 16 letters.\n";
            std::cin >> input;
        }
        for (char& ch : input) ch = (char)std::tolower((unsigned char)ch);
    }
    
    std::array<std::array<char, 4>, 4> grid;
    int idx = 0;
    for (int i = 0; i < 4; i++){
        for (int j = 0; j < 4; j++){
            grid[i][j] = input[idx++];
        }
    }
    
    Board board(grid);
    heap words = board.findWords(trie);
    
    while (!words.empty()){
        std::cout << words.top() << "\n";
        words.pop();
    }
    
    return 0;
}
