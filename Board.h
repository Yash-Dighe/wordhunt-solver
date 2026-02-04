#pragma once
#include "Trie.h"
#include <array>
#include <queue>
#include <unordered_set>

struct ByLength{
    bool operator()(const std::string& s1, const std::string& s2) const{
        return s1.length() != s2.length() ? s1.length() < s2.length() : s1 > s2;
    }
};

typedef std::priority_queue<std::string, std::vector<std::string>, ByLength> heap;

class Board{
public:
    Board(const std::array<std::array<char, 4>, 4>& grid);
    static void loadDictionary(const std::string& filename, Trie& trie);
    heap findWords(const Trie& trie);
    // void display() const;
private:
    std::array<std::array<char, 4>, 4> board;
    std::array<std::pair<int,int>, 8> next = {std::make_pair(0,1), 
                                                std::make_pair(1,0), 
                                                std::make_pair(0,-1), 
                                                std::make_pair(-1,0),
                                                std::make_pair(1,1),
                                                std::make_pair(1, -1),
                                                std::make_pair(-1,1),
                                                std::make_pair(-1, -1)};
    void dfs(int row, int col, 
             std::array<std::array<bool, 4>, 4>& visited,
             std::string& current,
             const Trie& trie,
             std::unordered_set<std::string>& seen,
             heap& results);
    
};