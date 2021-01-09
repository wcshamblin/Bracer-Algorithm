#!/usr/bin/python3
import copy
from itertools import combinations_with_replacement as combinations_wr
from itertools import permutations
from itertools import chain
from collections import OrderedDict
from collections import Counter
import math
from json import dumps, load
from functools import reduce
from operator import iconcat

# Binary tree deconstructor
# The most Python code to ever Python
def get_parents(child, sharedict):
    sharelist = [(iv, amount) for iv, amount in sharedict.items() if iv in child]
    sharelist = sorted(sharelist, key=lambda x: x[1])[::-1]
    parent=[b[0] for b in sharelist[:-1]]
    parent2 = parent[:-1]+[sharelist[-1][0]]
    for iv, value in sharedict.items():
        if iv in parent and iv in parent2:
            sharedict[iv] = value-1
    return([parent, parent2], sharedict)

# Combinator - returns all distributions from spikiest distribution
def combinate(plevel, lnum):
    # Can't have more than 2 1s because you cannot have more than two braces in any particular 2 pokemon breed
    # Combinations after first value must be part of a previous level
    return(list(chain.from_iterable([list(set([i for i in permutations(p)])) for p in [p for p in combinations_wr(list(range(1,int((2**(lnum-1)/2))+1)), r=lnum) if sum(p)==(2**(lnum-1)) and p.count(1) <=2]])))
    #return([p for p in combinations_wr(list(range(1,int((2**(lnum-1)/2))+1)), r=lnum) if sum(p)==(2**(lnum-1)) and p.count(1) <=2])

# List distance for finding optimal distribution from input
def listdistance(l1, l2):
    squares = [(p-q)**2 for p, q in zip(l1, l2)]
    return sum(squares)**.5

def treegen(distdict, target):
    treedict = {}
    sharedict = OrderedDict({iv:amount-1 for iv, amount in distdict.items()})

    treedict[len(distdict)] = [target]
    children=[target]

    for level in list(range(1, len(distdict)))[::-1]:
        children=[]
        treedict[level] = []
        for child in treedict[level+1]:
            branched_children, sharedict = get_parents(child, sharedict)
            for branched_child in branched_children:
                treedict[level].append(branched_child)
    return(treedict)

# Breed function
def boxbreed(data):
    # Data preprocessing
    breederlist = []
    for breeder in data["breeders"]:
        breederlist.append(sorted([iv for iv, state in breeder["ivs"].items() if state == True]))

    # Set target
    target = []
    for iv, state in data["target"]["ivs"].items():
        if state != False:
            target.append(iv)

    distributions = {} # key:[list] of (sets)
    # Start with 1
    lnum=1
    level = [1] # 1x
    while lnum < 7: # 2x - 6x
        level = [(sum(level))]+level # "Spikiest" distribution calculation
        distributions[lnum] = combinate(level, lnum)
        lnum+=1

    # Generate all trees from distributions
    treelist = []
    for distribution in distributions[len(target)]:
        distdict={}
        for value, stat in zip(distribution, list(target)): # Low -> high
            distdict[stat] = value
        distdict=OrderedDict(reversed(list(distdict.items()))) # Reverse so we can iterate high -> low
        tree = treegen(distdict, target)
        treelist.append(tree)

    # Find the best distribution and tree for the input
    treedict = {} # treevalue: tree
    for tree in treelist:
        breedercompare = breederlist.copy() # This resets tree by tree to make sure we don't re-use any breeders
        treevalue = 0
        for level, breeders in tree.items():
            for breeder in breeders:
                # print("Breeder, breeders", breeder, breeders)
                if sorted(breeder) in breedercompare: # Both are sorted
                    treevalue += (2**(len(breeder)-1))
                    if len(breeder) > 1:
                        treevalue += treevalue/2
                    breedercompare.remove(sorted(breeder)) # If we used a breeder, remove it from the pool

        if len(treedict) > 0: # If it's not empty, see if our current tree is better than the others
            if treevalue > max(treedict.keys()):
                del treedict[max(treedict.keys())] # Best tree so far, delete previous, otherwise don't add
                treedict[treevalue] = tree
        else:
            treedict[treevalue] = tree

    # Reassign breeder to tree
    treejson = {}
    tree = treedict[max(treedict.keys())]
    for treelevel, level in tree.items():
        for breeder in level:
            match = []
            for targetbreeder in data["breeders"]:
                if sorted(breeder) == sorted([iv for iv, state in targetbreeder["ivs"].items() if state == True]):
                    match = [targetbreeder]
                    data["breeders"].remove(targetbreeder)
            if not match:
                match = [breeder]
            if treelevel in treejson.keys():
                treejson[treelevel] += match
            else:
                treejson[treelevel] = match
    return(treejson)


if __name__ == '__main__':
    with open("test.json") as data:
        data = load(data)
    print(dumps(boxbreed(data)))