#!/usr/bin/python3
import copy
from itertools import combinations_with_replacement as combinations_wr
from collections import OrderedDict
from collections import Counter
import math
from json import dumps, load
from functools import reduce
from operator import iconcat

#def parse_post(data):


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
    return([p for p in combinations_wr(list(range(1,int((2**(lnum-1)/2))+1)), r=lnum) if sum(p)==(2**(lnum-1)) and p.count(1) <=2])

# List distance for finding optimal distribution from input
def listdistance(l1, l2):
    squares = [(p-q)**2 for p, q in zip(l1, l2)]
    return sum(squares)**.5

# Breed function
def boxbreed(data):
    # Data preprocessing
    # Count ivs to get inp
    inp = {"hp": 0,"atk": 0, "def": 0,"spa": 0,"spd": 0,"spe": 0}
    for breeder in data["breeders"]:
        for iv, state in breeder["ivs"].items():
            if state == "True":
                inp[iv]+=1

    # Set target
    target = []
    for iv, state in data["target"]["ivs"].items():
        if state != "False":
            target.append(iv)

    inp = {iv:state for iv, state in inp.items() if state != 0}
    inp = OrderedDict(sorted(inp.items(), key=lambda t: t[1]))
    if len(inp) <= 1:
        return("Not enough breeders")

    print(inp, target)

    distdict = {} # key:[list] of (sets)

    # Start with 1
    lnum=1
    level = [1] # 1x
    while lnum < 7: # 2x - 6x
        level = [(sum(level))]+level # "Spikiest" distribution calculation
        distdict[lnum] = combinate(level, lnum)
        lnum+=1

    # Distributions are contained in distdict according to level
    # Must fit input as best possible according to level and input distribution
    # Prioritize finding the closest match with the least possible breeders missing
    optdict={}
    perfect = False
    for lst in distdict[len(inp)]:
        dist=listdistance(sorted(inp.values()), sorted(lst))
        if dist==0: # We've reached a perfect distribution (the only one), we can stop
            optdist = lst
            perfect = True
            break
        optdict[dist] = sorted(lst)
    if not perfect:
        optdist = sorted(optdict[min(optdict.keys())])
    # Optimal distribution and input are sorted the same way so we can match
    inpindex = list(inp.keys())

    distdict={}
    for value, stat in zip(optdist, inpindex): # Low -> high
        distdict[stat] = value
    distdict=OrderedDict(reversed(list(distdict.items()))) # Reverse so we can iterate high -> low

    # We know the distribution, now we need to construct a tree from it
    # TREE CONSTRUCTION RULES:
    # A 2x cannot have two of the same IV
    # 2xs connected to the same 3x must share an IV
    # 3x branches have two shared IVs, and two new IVs
    # 4x branches have three shared IVs, and two new IVs
    # 5x branches have four shared IVs, and two new IVs
    # 6x branches have five shared IVs, and two new IVs
    # The amount of time any single stat is shared is the distribution value minus one
    # In a 4 2 1 1 (4x) distribution, 4 must be shared three times through the tree
    # This means that it must be present in SIX nodes
    # Remember, order does not matter if branching from the same node

    # Deconstruction
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

    return(dumps(treedict, indent=4, sort_keys=True))


if __name__ == '__main__':
    with open("test.json") as data:
        data = load(data)
    print(boxbreed(data))