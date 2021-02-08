#!/usr/bin/python3
import copy
from itertools import combinations_with_replacement as combinations_wr
from itertools import permutations
from itertools import chain
from collections import OrderedDict
from collections import Counter
import math
from time import time
from json import dumps, load
from functools import reduce
from operator import iconcat
from multiprocessing import Pool
from multiprocessing import cpu_count

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
def combinate(lnum):
    # Can't have more than 2 1s because you cannot have more than two braces in any particular 2 pokemon breed
    # Combinations after first value must be part of a previous level
    combs = [p for p in combinations_wr(list(range(1,int((2**(lnum-1)/2))+1)), r=lnum) if sum(p)==(2**(lnum-1)) and p.count(1) <=2]
    # Braced IVs can switch order without affecting tree - (4, 2, 1, 1) is identical to (4, 2, 1, 1) where 1s switch
    perms = list(chain.from_iterable([list(set([i for i in permutations(p)])) for p in combs])) # Set removes dups (4 2 1 <-> 1)
    return(perms)

# List distance for finding optimal distribution from input
def listdistance(l1, l2):
    squares = [(p-q)**2 for p, q in zip(l1, l2)]
    return sum(squares)**.5

def jsonify(ivlist):
    breeder = {"ivs": {"hp": False, "atk": False, "def": False, "spa": False, "spd": False, "spe": False}, "name": False, "nature": False}
    for iv in ivlist:
        breeder["ivs"][iv] = True
    return breeder

# Generate tree from distribution and target - this is poorly optimized
def treegen(distdict, target, breederlist):
    # simplebreeders follows the format of [iv, iv, iv] (sorted)
    tempbreeders = breederlist.copy()
    simplebreeders = []
    perfect = False
    treedict = {}
    sharedict = OrderedDict({iv:amount-1 for iv, amount in distdict.items()})

    treedict[len(distdict)] = [target]

    for level in list(range(1, len(distdict)))[::-1]:
        treedict[level] = []

        for child in treedict[level+1]:
            if not child: # Is a placeholder - fill placeholders below
                treedict[level].append([])
                treedict[level].append([])

            if type(child) != dict: # Isn't a breeder - we can split it!
                branched_children, sharedict = get_parents(child, sharedict) # Split
                firstisbreeder = False

                if branched_children[0] in [sorted([iv for iv, state in breeder["ivs"].items() if state == True]) for breeder in tempbreeders]: # is the first child a breeder?
                    firstisbreeder = True
                    # Find fancybreeder, remove from pool
                    for breeder in tempbreeders:
                        if branched_children[0] == sorted([iv for iv, state in breeder["ivs"].items() if state == True]):
                            fancybreeder = breeder
                            tempbreeders.remove(breeder)
                            break
                    treedict[level].append(fancybreeder)

                else:
                    treedict[level].append(branched_children[0])

                addedcompat = False
                if branched_children[1] in [sorted([iv for iv, state in breeder["ivs"].items() if state == True]) for breeder in tempbreeders]:
                    if firstisbreeder: # First is already a breeder, need to match second against it
                        for breeder in tempbreeders:  # Find a second fancy breeder that matches the first - if none found, add simplebreeder
                            if branched_children[1] == sorted([iv for iv, state in breeder["ivs"].items() if state == True]):
                                if fancybreeder["name"] == breeder["name"]: # Placeholder compat check
                                    addedcompat = True
                                    treedict[level].append(breeder)
                                    tempbreeders.remove(breeder)

                    else: # First isn't a breeder - we can just add another fancybreeder without compat checking
                        for breeder in tempbreeders:
                            if branched_children[1] == sorted([iv for iv, state in breeder["ivs"].items() if state == True]):
                                tempbreeders.remove(breeder)
                                break
                        treedict[level].append(breeder)

                if branched_children[1] not in [sorted([iv for iv, state in breeder["ivs"].items() if state == True]) for breeder in tempbreeders]: # If we don't have a matching breeder OR we don't have a compatable breeder
                    treedict[level].append(branched_children[1])

            else: # Is a breeder - don't split it, add placeholders to branch
                treedict[level].append([])
                treedict[level].append([])

        score = 0
        if not tempbreeders: # No more breeders to take from - tree is perfect
            perfect = True
        else:
            for breeder in tempbreeders:
                score += (2**len([sorted([iv for iv, state in breeder["ivs"].items() if state == True])])-1)
    return(treedict, perfect, score)



# Breed function
def boxbreed(data):
    # Data preprocessing
    breederlist = data["breeders"]

    # Set target
    target = []
    for iv, state in data["target"]["ivs"].items():
        if state is not False:
            target.append(iv)

    distributions = {} # key:[list] of (sets)
    # Start with 1
    for lnum in range(2,7): # 2x - 6x
        distributions[lnum] = combinate(lnum)
    # Ditch obviously non-optimal distributions
    # In a 6x tree, if there is a 5x and 1 1xs, then you have to use the 5x in the most optimal tree


    # Generate all trees from distributions - THIS IS A BOTTLENECK
    t1=time()
    procpool = Pool(cpu_count()) # Set up processing pool
    args = []
    treedict = {}
    for distribution in distributions[len(target)]:
        distdict={}
        for value, stat in zip(distribution, list(target)): # Low -> high
            distdict[stat] = value
        distdict=OrderedDict(reversed(list(distdict.items()))) # Reverse so we can iterate high -> low
        tree, perfect, score = treegen(distdict, target, breederlist)
        treedict[score] = tree
        if perfect:
            break
    treedict = treedict[min(treedict.keys())]    

    # for distribution in distributions[len(target)]:
    #     distdict={}
    #     for value, stat in zip(distribution, list(target)): # Low -> high
    #         distdict[stat] = value
    #     distdict = OrderedDict(reversed(list(distdict.items()))) # Reverse so we can iterate high -> low
    #     args.append((distdict, target, breederlist))

    # results = procpool.starmap_async(treegen, args)
    # results = results.get()
    # treelist = [res[0] for res in results]

    t2=time()
    # print("Treegen:", t2-t1)



    t1=time()
    # JSONify entire tree
    outtree = {}
    for lnum, breeders in treedict.items():
        outtree[lnum] = []
        for breeder in breeders:
            if type(breeder) == list:
                outtree[lnum].append(jsonify(breeder))
            else:
                outtree[lnum].append(breeder)
    t2=time()
    # print("JSONify:", t2-t1)

    return(outtree)


if __name__ == '__main__':
    with open("test.json") as data:
        data = load(data)
    print(dumps(boxbreed(data)))