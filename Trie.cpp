#include "Trie.h"

Trie::Trie(){
    root = std::make_unique<Node>();
}

//might also be able to handle isWord logic here
void Trie::insert(const std::string& word){
    Node* curr = root.get();
    for (auto c : word){
        if (curr->children.find(c) == curr->children.end()){
            curr->children[c] = std::make_unique<Node>();
        }
        curr = curr->children[c].get();
    }
    curr->isWord = true; //should be good
}

bool Trie::contains(const std::string& word) const{
    Node* curr = root.get();
    for (auto c : word){
        if (curr->children.find(c) == curr->children.end()){
            return false;
        }
        curr = curr->children[c].get();
    }
    return curr->isWord;
}

//this will help early exit during dfs
bool Trie::isPre(const std::string& prefix) const{
    Node* curr = root.get();
    for (auto c : prefix){
        if (curr->children.find(c) == curr->children.end()){
            return false;
        }
        curr = curr->children[c].get();
    }
    return true;
}