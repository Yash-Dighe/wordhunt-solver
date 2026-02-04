#pragma once
#include <unordered_map>
#include <string>
#include <memory>

struct Node{
    bool isWord = false;
    std::unordered_map<char, std::unique_ptr<Node>> children;
};

class Trie{
public:
    Trie();
    void insert(const std::string& word);
    bool contains(const std::string& word) const;
    bool isPre(const std::string& prefix) const; 

private:
    std::unique_ptr<Node> root;
};
