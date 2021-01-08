#!/usr/bin/python3
import copy
from itertools import combinations_with_replacement as combinations_wr
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
    return([p for p in combinations_wr(list(range(1,int((2**(lnum-1)/2))+1)), r=lnum) if sum(p)==(2**(lnum-1)) and p.count(1) <=2])

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
    # Count ivs to get inp
    inp = {"hp": 0,"atk": 0, "def": 0,"spa": 0,"spd": 0,"spe": 0}

    breederlist = []
    for breeder in data["breeders"]:
        breederlist.append([iv for iv, state in breeder["ivs"].items() if state == "True"])

    # This is breaking apart 2xs+
    for breeder in data["breeders"]:
        for iv, state in breeder["ivs"].items():
            if state == "True":
                inp[iv]+=1 

    # Set target
    target = []
    for iv, state in data["target"]["ivs"].items():
        if state != "False":
            target.append(iv)

    inp = {"hp": 20,"atk": 20, "def": 20,"spa": 20,"spd": 20,"spe": 20}
    inp = {iv:state for iv, state in inp.items() if state != 0 and iv in target}
    inp = OrderedDict(sorted(inp.items(), key=lambda t: t[1]))
    if len(inp) <= 1:
        return("Not enough breeders")

    distributions = {} # key:[list] of (sets)
    # Start with 1
    lnum=1
    level = [1] # 1x
    while lnum < 7: # 2x - 6x
        level = [(sum(level))]+level # "Spikiest" distribution calculation
        distributions[lnum] = combinate(level, lnum)
        lnum+=1

    treelist = []
    for distribution in distributions[len(target)]: # 5x level
        distdict={}
        for value, stat in zip(distribution, list(inp.keys())): # Low -> high
            distdict[stat] = value
        distdict=OrderedDict(reversed(list(distdict.items()))) # Reverse so we can iterate high -> low
        tree = treegen(distdict, target)
        treelist.append(tree)

    # Find the best distribution and tree for the input
    treedict = {} # treevalue: tree
    for tree in treelist:
        treevalue = 0
        for level, breeders in tree.items():
            for breeder in breeders:
                if breeder in breederlist:
                    treevalue += 2**(len(breeder)-1)
        if len(treedict)>0:
            if treevalue > max(treedict.keys()):
                del treedict[max(treedict.keys())]
                treedict[treevalue] = tree
        else:
            treedict[treevalue] = tree


    # Reassign breeder to tree
    treejson = {}
    tree = treedict[max(treedict.keys())]
    for treelevel, level in tree.items():
        for breeder in level:
            for targetbreeder in data["breeders"]:
                if sorted(breeder) == sorted([iv for iv, state in targetbreeder["ivs"].items() if state == "True"]):
                    if treelevel in treejson.keys():
                        treejson[treelevel]+=[targetbreeder]
                else:
                    treejson[treelevel] = [targetbreeder]

    return(dumps(treedict, indent=4, sort_keys=True))
    exit()


if __name__ == '__main__':
    with open("test.json") as data:
        data = load(data)
    print(boxbreed(data))