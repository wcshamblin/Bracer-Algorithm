#!/usr/bin/python3
import copy
from itertools import combinations_with_replacement as combinations_wr
from itertools import permutations
from itertools import chain

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
    combs_validated = []
    for comb in combs:
        comb = sorted(comb)
        valid = True
        for index in range(1, len(comb)):
            if sum(comb[0:index]) < (2**(index-1)):
                valid = False
        if valid:
            combs_validated.append(comb)
    # Braced IVs can switch order without affecting tree - (4, 2, 1, 1) is identical to (4, 2, 1, 1) where 1s switch
    perms = list(chain.from_iterable([list(set([i for i in permutations(p)])) for p in combs_validated])) # Set removes dups (4 2 1 <-> 1)
    return(perms)

def egggroupcompat(breeder1, breeder2):
    if (breeder1["name"] == "ditto" or breeder2["name"] == "ditto") and (breeder2["name"] != breeder1["name"]):
        return True
    if bool(set(breeder1["eggGroups"]) & set(breeder2["eggGroups"])):
        return True
    return False

def gendercompat(breeder1, breeder2):
    genders = sorted([breeder1["gender"], breeder2["gender"]])

    if genders == ["female", "male"]:
        return True
    if genders == ["genderless", "genderless"] and breeder1["name"] == breeder2["name"]:
        return True
    return False

def breedercompat(breeder1, breeder2):
    if egggroupcompat(breeder1, breeder2) and gendercompat(breeder1, breeder2):
        return True
    else:
        return False

# List distance for finding optimal distribution from input
def listdistance(l1, l2):
    squares = [(p-q)**2 for p, q in zip(l1, l2)]
    return sum(squares)**.5

def jsonify(ivlist, isbreeder):
    breeder = {"name": False,"ivs":{"hp":False,"atk":False,"def":False,"spa":False,"spd":False,"spe":False},"nature":False,"gender":False,"eggGroups":[], "breeder":isbreeder}
    for iv in ivlist:
        breeder["ivs"][iv] = True
    return breeder

def convertbreeder(breeder, isbreeder):
    if type(breeder) == dict:
        return sorted([iv for iv, state in breeder["ivs"].items() if state != False])
    if type(breeder) == list:
        return jsonify(breeder, isbreeder)
    return []
    
def findaddbreeder(treelevel, branched_parents, tempbreeders, index):
    for breeder in tempbreeders:
        if branched_parents[index] == sorted([iv for iv, state in breeder["ivs"].items() if state != False]):
            tempbreeders.remove(breeder)
            break
    treelevel.append(breeder)

def isinbreeders(inputmon, breeders):
    for breeder in breeders:
        isbreeder = True
        for attribute, value in inputmon.items():
            if value != False:
                if breeder[attribute] != value:
                    isbreeder = False
                    continue
        if isbreeder:
            return True, breeder
    return False, inputmon

def findcompatbreeder(inputmon, compatto, breeders):
    for breeder in breeders:
        isbreeder = True
        for attribute, value in inputmon.items():
            if value != False:
                if breeder[attribute] != value:
                    isbreeder = False
                    continue
        if isbreeder:
            if breedercompat(breeder, compatto):
                return True, breeder
    return False, inputmon
