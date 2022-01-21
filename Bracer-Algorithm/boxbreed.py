#!/usr/bin/python3
import copy
from collections import OrderedDict
from time import time
from json import dumps, load
from functools import reduce
from multiprocessing import Pool
from multiprocessing import cpu_count
from boxbreedutils import get_parents, combinate, jsonify, convertbreeder, findbreeder, findcompatbreeder, itemify

# Generate tree from distribution and target - this is poorly optimized
def treegen(distdict, target, breederlist, complextargetivs):
    #print("\nStarting a new tree")
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
                continue # Restart loop

            if not child["data"]["breeder"]: # Isn't a breeder - we can split it!
                child = convertbreeder(child, complextargetivs) # dict -> list
                branched_parents, sharedict = get_parents(child, sharedict) # Split

                branched_parents = [convertbreeder(parent, complextargetivs) for parent in branched_parents] # Convert split back into dict


                # If findbreeder, findcompatbreeder fails, input mon is returned (simple)
                firstisbreeder, firstbreeders = findbreeder(branched_parents[0], tempbreeders)

                if not firstisbreeder:
                    #print("First is not breeder, using placeholder")
                    treedict[level].append(firstbreeders[0])

                if firstisbreeder:
                    #print("First is breeder, compat checking")
                    # Compat checking
                    addedcompat, firstbreeder, secondbreeder = findcompatbreeder(branched_parents, firstbreeders, tempbreeders)
                    if addedcompat:
                        #print("Found compat, both are breeders")
                        tempbreeders.remove(firstbreeder)
                        tempbreeders.remove(secondbreeder)
                        
                        treedict[level].append(firstbreeder)
                        treedict[level].append(secondbreeder)
                    
                    else:
                        treedict[level].append(firstbreeders[0])
                        tempbreeders.remove(firstbreeders[0])
                        treedict[level].append(secondbreeder)

                else:
                    # Add without compat
                    secondisbreeder, secondbreeders = findbreeder(branched_parents[1], tempbreeders)
                    if secondisbreeder:
                        #print("Secondbreeder is breeder")
                        tempbreeders.remove(secondbreeders[0])
                    #print("Adding secondbreeder")
                    treedict[level].append(secondbreeders[0])

            else: # Is a breeder - don't split it, add placeholders to branch
                treedict[level].append([])
                treedict[level].append([])

        # Scoring
        score = 0
        if not tempbreeders: # No more breeders to take from - tree is perfect
            perfect = True
        else:
            for breeder in tempbreeders:
                # x^2 for naive non-brace score, .08 added to accomidate for bracing and misc prices
                score += round(len(convertbreeder(breeder))**2.08) 
    return(treedict, perfect, score, tempbreeders)



# Breed function
def boxbreed(data):
    # Data preprocessing
    breederlist = data["breeders"]

    # Set target
    target = data["target"]
    complextargetivs = target["data"]["ivs"]
    simpletarget = []
    for iv, state in target["data"]["ivs"].items():
        if state != -1:
            simpletarget.append(iv)

    target["data"]["breeder"] = False


    prunedbreeders = []

    for breeder in breederlist:
        toappend = False
        for iv, value in breeder["data"]["ivs"].items():
            if value == 31 and complextargetivs[iv] == -1:
                toappend = False
                break
            if complextargetivs[iv] != value:
                breeder["data"]["ivs"][iv] = -1
            if complextargetivs[iv] == value and value != -1:
                toappend = True
        if toappend:
            prunedbreeders.append(breeder)

    [print("Breeder (after prune):", breeder) for breeder in prunedbreeders]
    print("\nTarget:", complextargetivs, "\n")


    distributions = {} # key:[list] of (sets)
    # Start with 1
    for lnum in range(2,7): # 2x - 6x
        distributions[lnum] = combinate(lnum)

    ## TO DO
    # Ditch obviously non-optimal distributions
    # In a 6x tree, if there is a 5x and 1 1xs, then you have to use the 5x in the most optimal tree


    # Generate all trees from distributions
    t1=time()
    # procpool = Pool(cpu_count()) # Set up processing pool
    
    args = []
    treedict = {}
    for distribution in distributions[len(simpletarget)]:
        distdict={}
        for value, stat in zip(distribution, list(simpletarget)): # Low -> high
            distdict[stat] = value
        distdict=OrderedDict(reversed(list(distdict.items()))) # Reverse so we can iterate high -> low
        tree, perfect, score, remainingbreeders = treegen(distdict, target, prunedbreeders, complextargetivs)
        treedict[score] = tree
        if perfect:
            break

    # Use the tree with the lowest score as the final tree
    treedict = treedict[min(treedict.keys())]
    print("Final treedict:", treedict)   

    # t2=time()
    # # print("Treegen:", t2-t1)


    # t1=time()
    # # JSONify entire tree
    outtree = {}

    for lnum, breeders in treedict.items():
        outtree[lnum] = []
        if len(breeders) == 1:
            outtree[lnum].append(jsonify(breeders[0], complextargetivs))
            continue

        for i in range(0, len(breeders), 2):
            b1 = jsonify(breeders[i], complextargetivs)
            b2 = jsonify(breeders[i+1], complextargetivs)

            outtree[lnum].append(itemify(b1, b2))
            outtree[lnum].append(itemify(b2, b1))

    # t2=time()
    # print("JSONify:", t2-t1)

    return(outtree)
    # return({"tree": outtree, "remainingbreeders": treedict["remaining"]})


if __name__ == '__main__':
    with open("test.json") as data:
        data = load(data)
    print(dumps(boxbreed(data)))