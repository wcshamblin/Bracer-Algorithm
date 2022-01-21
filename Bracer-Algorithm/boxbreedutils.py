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

# Works
def egggroupcompat(breeder1, breeder2):
    if bool(set(breeder1["data"]["eggGroups"]) & set(breeder2["data"]["eggGroups"])) and not breeder1["data"]["name"] == breeder2["data"]["name"] == "ditto":
        return True
    return False

# Works
def gendercompat(breeder1, breeder2):
    genders = sorted([breeder1["data"]["gender"], breeder2["data"]["gender"]])
    if genders == ["female", "male"]:
        return True
    if genders == ["genderless", "genderless"] and breeder1["data"]["name"] == breeder2["data"]["name"]:
        return True
    return False

# Works
def breedercompat(breeder1, breeder2):
    if (breeder1["data"]["name"] == "ditto" or breeder2["data"]["name"] == "ditto") and (breeder2["data"]["name"] != breeder1["data"]["name"]):
        return True
    if egggroupcompat(breeder1, breeder2) and gendercompat(breeder1, breeder2):
        return True
    return False

# List distance for finding optimal distribution from input
def listdistance(l1, l2):
    squares = [(p-q)**2 for p, q in zip(l1, l2)]
    return sum(squares)**.5

def jsonify(ivlist, targetivs, item=False):
    if type(ivlist) == dict:
        ivlist["data"]["item"] = item
        return ivlist
    breeder = {'id': '', 'data': {'name': False, 'ivs': {'hp': -1, 'atk': -1, 'def': -1, 'spa': -1, 'spd': -1, 'spe': -1}, 'nature': '', 'eggGroups': [], 'gender': '', 'possibleGenders': [], 'breeder': False, 'item': False}}

    breeder["data"]["item"] = item
    for iv in ivlist:
        breeder["data"]["ivs"][iv] = targetivs[iv]
    return breeder



def itemify(breeder1, breeder2):
    print("Itemifying")
    print(breeder1["data"]["ivs"].items(), breeder2["data"]["ivs"].items())
    # Define power items
    for iv, state in breeder1["data"]["ivs"].items():
        print(iv, state)
        if state != -1 and breeder2["data"]["ivs"][iv] == -1:
            print("Itemifying with", iv)
            breeder1 = jsonify(breeder1, iv, iv)
            break
    print("Breeder after itemify:", breeder1)
    return breeder1


# Works
def convertbreeder(breeder, targetivs=False):
    if type(breeder) == dict:
        return sorted([iv for iv, state in breeder["data"]["ivs"].items() if state != -1])
    if type(breeder) == list: # Simplebreeder
        return jsonify(breeder, targetivs)
    return []
    


def findbreeder(inputmon, breeders):
    matchedbreeders = []
    for breeder in breeders:
        isbreeder = True

        # This is only checking IVs
        if inputmon["data"]["ivs"] != breeder["data"]["ivs"]:
            isbreeder = False

        # Checking for more?
        # for attribute, value in inputmon["data"].items():
        #     if value != -1 and value:
        #         if breeder["data"][attribute] != value:
        #             isbreeder = False
        #             continue

        if isbreeder:
            matchedbreeders.append(breeder)
    if matchedbreeders: # There is a match found
        return True, matchedbreeders
    return False, [inputmon]



def findcompatbreeder(inputmon, compatto, breeders):
    for breeder in breeders:
        isbreeder = True
        # Find a valid breeder for the second input mon based on IVs
        # for attribute, value in inputmon[1].items():
        #     if value != False and value:
        #         if breeder[attribute] != value:
        #             isbreeder = False
        #             continue
        if inputmon[1]["data"]["ivs"] != breeder["data"]["ivs"]:
            isbreeder = False 
        # Did we find a valid breeder? If so, check compat
        if isbreeder:
            for possiblecompat in compatto:
                if breedercompat(breeder, possiblecompat):
                    return True, possiblecompat, breeder
    # If no compat, return simple breeders (input)
    return False, inputmon[0], inputmon[1]