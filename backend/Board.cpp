#include "Board.h"
#include <fstream>
#include <iostream>
#include <unordered_set>
#include <cctype>

Board::Board(const std::array<std::array<char, 4>, 4>& grid){
    board = grid;
}

void Board::loadDictionary(const std::string& filename, Trie& trie){
    std::ifstream file(filename);
    if (!file.is_open()){
        std::cerr << "Couldn't open dictionary: " << filename << std::endl;
        return;
    }
    std::string word;
    while (std::getline(file, word)){
        for (char& ch : word) ch = (char)std::tolower((unsigned char)ch);
        trie.insert(word);
    }
}

void Board::dfs(int row, int col, 
                std::array<std::array<bool, 4>, 4>& visited,
                std::string& current,
                const Trie& trie,
                std::unordered_set<std::string>& seen,
                heap& results){
    
    current += board[row][col];
    visited[row][col] = true;

    if (!trie.isPre(current)){
        visited[row][col] = false;
        current.pop_back();
        return;
    }
    
    if (current.length() >= 3 && trie.contains(current)){
        if (seen.find(current) == seen.end()){
            seen.insert(current);
            results.push(current);
        }
    }
    
    for (const auto& dir : next){
        int newRow = row + dir.second;
        int newCol = col + dir.first;
        
        if (newRow >= 0 && newRow < 4 && 
            newCol >= 0 && newCol < 4 && 
            !visited[newRow][newCol]){
            
            dfs(newRow, newCol, visited, current, trie, seen, results);
        }
    }
    
    visited[row][col] = false;
    current.pop_back();
}

heap Board::findWords(const Trie& trie){
    heap results;
    std::unordered_set<std::string> seen;
    
    for (int row = 0; row < 4; row++){
        for (int col = 0; col < 4; col++){
            std::array<std::array<bool, 4>, 4> visited = {};
            std::string current = "";
            dfs(row, col, visited, current, trie, seen, results);
        }
    }
    
    return results;
}
