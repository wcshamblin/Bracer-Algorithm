#!/usr/bin/python3
from collections import OrderedDict
from collections import Counter
from json import dumps

hp = 9000
attack = 10200
defense = 10000
spattack = 5000
spdefense = 10000
speed = 10400
braces = "py" # "rp"

prices = {'hp': hp, 'atk': attack, 'def': defense, 'spa': spattack, 'spd': spdefense, 'spe': speed}
target = {'hp': hp, 'atk': attack, 'def': defense, 'spa': spattack, 'spd': spdefense, 'spe': speed}

for iv, price in prices.items():
	if price == 0:
		del target[iv]
target = OrderedDict(sorted(target.items(), key=lambda t: t[1]))
ivorder = list(target.keys())

# 32 16 8 4 2 1 1
# 16 8 4 2 1 1
# 8 4 2 1 1
levelkey = ["l1x", "l2x", "l3x", "l4x", "l5x", "l6x"]
levels = {"l6x": OrderedDict({"1xl": [[0], [1], [0], [2], [0], [1], [0], [3], [0], [1], [0], [2], [0], [1], [0], [4], [0], [1], [0], [2], [0], [1], [0], [3], [0], [1], [0], [2], [0], [1], [0], [5]], 
					"2xl": [[0,1], [0,2], [0,1], [0,3], [0,1], [0,2], [0,1], [0,4], [0,1], [0,2], [0,1], [0,3], [0,1], [0,2], [0,1], [0,5]],
					"3xl": [[0,1,2], [0,1,3], [0,1,2], [0,1,4], [0,1,2], [0,1,3], [0,1,2], [0,1,5]], 
					"4xl": [[0,1,2,3], [0,1,2,4], [0,1,2,3], [0,1,2,5]],
					"5xl": [[0,1,2,3,4], [0,1,2,3,5]],
					"6xl": [[0,1,2,3,4,5]]}),
		  "l5x": OrderedDict({"1xl": [[0], [1], [0], [2], [0], [1], [0], [3], [0], [1], [0], [2], [0], [1], [0], [4]], 
					"2xl": [[0,1], [0,2], [0,1], [0,3], [0,1], [0,2], [0,1], [0,4]],
					"3xl": [[0,1,2], [0,1,3], [0,1,2], [0,1,4]], 
					"4xl": [[0,1,2,3], [0,1,2,4]],
					"5xl": [[0,1,2,3,4]]}),
		  "l4x": OrderedDict({"1xl": [[0], [1], [0], [2], [0], [1], [0], [3]],
					"2xl": [[0,1], [0,2], [0,1], [0,3]],
					"3xl": [[0,1,2], [0,1,3]],
					"4xl": [[0,1,2,3]]}),
		  "l3x": OrderedDict({"1xl": [[0], [1], [0], [2]], 
					"2xl": [[0,1], [0,2]],
					"3xl": [[0,1,2]]}),
		  "l2x": OrderedDict({"1xl": [[0], [1]],
		  			"2xl": [[0,1]]}),
		  "l1x": OrderedDict({"1xl": [[0]]})}

# 5x unnatured   | ^
# 4x unnatured M | |
# 3x unnatured F | |
# 2x unnatured M | |
# 1x natured   F >-|

# 6x unnatured   | ^
# 5x unnatured M | |
# 4x unnatured F | |
# 3x unnatured M | |
# 2x unnatured F | |
# 1x natured   M >-|

# Species must traverse top branch, so we know the first two branch's genders and species. All others alternate
# If 5x (un)natured is 

def generatetree(xlevel):
	breedtree={}
	for level, ivl in xlevel.items():
		breedercount=0
		for ivs in ivl:
			if level not in breedtree:
				breedtree[level] = []
			if breedercount==0:
				gender = "F"
			elif breedercount==1:
				gender = "M"
			else:
				gender = "F/M"
				if breedercount%2==0:
					gender = "M/F"
			ivs=[ivorder[iv] for iv in ivs]
			breedtree[level].append({"ivs": ivs, "gender": gender})
			breedercount+=1
	return breedtree

for level in range(0,len(ivorder)):
	print("Tree level", level+1)
	print(dumps(generatetree(levels[levelkey[level]]), indent=4, sort_keys=True))

# Pricing
# pricedict = {}
# pricedict["braces"] = int(sum([len(mons) for level, mons in breedtree.items()]))
# if "braces" == "rp":
# 	pricedict["braces"]*=750
# else:
# 	pricedict["braces"]*=10000
# mons={}
# for mon in breedtree["1xl"]:
# 	if mon["ivs"][0] not in mons:
# 		mons[mon["ivs"][0]]=1
# 	else:
# 		mons[mon["ivs"][0]] += 1
# for iv, count in mons.items():
# 	pricedict[iv] = (prices[iv]*count)
# print(pricedict)
# print(sum(pricedict.values()))
# print(dumps(breedtree, indent=4, sort_keys=True))