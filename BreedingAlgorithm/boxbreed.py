#!/usr/bin/python3
import copy
from collections import OrderedDict
from time import time
from json import dumps, load
from functools import reduce
from multiprocessing import Pool
from multiprocessing import cpu_count
from boxbreedutils import get_parents, combinate, breedercompat, jsonify, findaddbreeder

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
            if not child: # Is an empty list placeholder - fill placeholders below
                treedict[level].append([])
                treedict[level].append([])
                continue

            if type(child) != dict: # Isn't a breeder - we can split it!
                branched_children, sharedict = get_parents(child, sharedict) # Split
                firstisbreeder = False

                if branched_children[0] in [sorted([iv for iv, state in breeder["ivs"].items() if state == True]) for breeder in tempbreeders]: # is the first child a breeder?
                    firstisbreeder = True
                    # Find fancybreeder, remove from pool
                    findaddbreeder(treedict[level], branched_children, tempbreeders, 0)
                    firstbreeder = treedict[level][-1]

                else:
                    treedict[level].append(branched_children[0])

                addedcompat = False
                if branched_children[1] in [sorted([iv for iv, state in breeder["ivs"].items() if state == True]) for breeder in tempbreeders]: # is the second child a breeder?
                    if firstisbreeder: # First is already a breeder, need to match second against it
                        for breeder in tempbreeders:  # Find a second fancy breeder that matches the first - if none found, add simplebreeder
                            if branched_children[1] == sorted([iv for iv, state in breeder["ivs"].items() if state == True]):
                                if breedercompat(firstbreeder, breeder): # Are the breeders compatable
                                    addedcompat = True
                                    treedict[level].append(breeder)
                                    tempbreeders.remove(breeder)

                    else: # First isn't a breeder - we can just add another fancybreeder without compat checking
                        findaddbreeder(treedict[level], branched_children, tempbreeders, 1)
                        addedcompat = True

                if not addedcompat: # If we don't have a matching breeder OR we don't have a compatable breeder
                    treedict[level].append(branched_children[1])

            else: # Is a breeder - don't split it, add placeholders to branch
                treedict[level].append([])
                treedict[level].append([])

        # Scoring
        score = 0
        if not tempbreeders: # No more breeders to take from - tree is perfect
            perfect = True
        else:
            for breeder in tempbreeders: 
                score += (2**len([sorted([iv for iv, state in breeder["ivs"].items() if state == True])])+1)
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