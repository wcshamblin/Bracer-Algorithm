# [Bracer](https://bracer.app/)

## Planned features

- Upstream breeding compat checking
- GTL breeding
- General quality of life improvements + bugfixes

## How it works

### The basics of Pokemon breeding

The intent of Pokemon breeding is to mate certain Pokemon together to result in one Pokemon that has certain IVs and a certain nature. Pokemon have 6 IVs, and 25 available natures. The function of these doesn't really matter for understanding this algorithm, but you can read about IVs [here](https://bulbapedia.bulbagarden.net/wiki/Individual_values) and natures [here](https://pokemondb.net/mechanics/natures).

Just some basic notation:

```
HP  - Health Points
Atk - Attack
Def - Defense
Spa - Special Attack
Spd - Special Defense
Spe - Speed
```

When you read (number)x - 1x, 2x, 3x, 4x, 5x, 6x - this refers to the number of target stats. So in a Pokemon where you want a specific HP, attack, and defense, that would be a 3x, as 3 stats are being targeted.


IV sharing works through things called "power items". The power items are listed as follows:

```
HP  - Power Weight
Atk - Power Bracer
Def - Power Belt
Spa - Power Lens
Spd - Power Band
Spe - Power Anklet
```

Here are some basic rules:

- Power items, when held by a Pokemon, ensure that when bred, that IV from that Pokemon will carry down to its child. A Pokemon can only hold *one* of these items.
- If two breeding Pokemon share an IV, that IV is guaranteed.
- If a Pokemon is holding an Everstone, it will pass down its nature.
- **A Pokemon can only hold one item.**


Natures aren't particularly important as they are not really utilized in the algorithm and are accounted for later, so forget about Everstones for now.

With these rules in place, here's a basic breeding tree:

![Basic breeding tree](https://imgur.com/r7vbpDn.png)

And here's a breeding tree for a 5x target:

![5x breeding tree](https://imgur.com/mx4A4Fl.png)

The indicators in the middle show the number of shared IVs between each Pokemon of that certain level, and numbers 1 - 5 represent stats.

Now, for some more complex rules. Everything that follows is not an "official" rule and it is something that we have developed to make sense of the breeding tree and implement the algorithm.

### Distributions
Distributions refer to the number of breeders in any one stat within a tree. They correspond immediately with trees, there is only one distribution associated with any one tree (order withstanding), and there is only one tree associated with any one distribution

So, for example, in a 4x31 tree, a possible distribution is `4 2 1 1`, where 4 is the number of hp breeders, 2 is the number of atk breeders, and so on.

Distributions are assumed to be sorted with the highest value on the left, and follow the following order of stats:

`hp atk def spa spd spe`


#### Distributions follow a particular set of rules, as follows.
#### - Distributions length is equal to level l (where l is the number of targeted stats - for example 5x31 being l=5)

At l=4, distributions must have 4 individual numbers corresponding to each stat


#### - The spikiest (most uneven) distribution is represented by the following sequence:

![Spikiest distribution equation](https://imgur.com/tnSH9jM.png)



#### - Distributions must sum to 2 to the power of the number of stats in the tree minus one
Assuming *x sub n* is a sequence containing a potential distribution, and *l* being the target level, this is represented by the following equation:

![Distribution rule equation 1](https://imgur.com/KBMTX0I.png)



In a 5x31, there are 5 targeted stats. This means the sum of each distribution for a 5x31 must sum to `2^(5-1) = 16`.


8+4+2+1+1 = 16 - this distribution is valid

9+5+2+1+1 = 18 - this distribution is not valid


#### - Distributions cannot contain more than two 1s
Again assuming *x sub n* is a sequence containing the distribution and *l* being the target level;

![Distribution rule equation 2](https://imgur.com/dPX68VM.png)

This is due to the way the binary tree shares IVs through the branches.
The two 1s are able to rest on the very outside edge of the base of the tree and pass upward, but there is no other space for another 1 to fit. (This does not mean distributions HAVE to contain two 1s)


#### - Assuming a sorted distribution where the leftmost value is the highest, for every slot of any distribution (excluding the first slot), the sum of the slots to the left must be less than 2 to the power of the slot index minus one.

Represented mathematically where *s* is the index of the current slot, this rule must apply to every *s* within any particular distribution;

![Distribution rule equation 3](https://imgur.com/DuBfhSz.png)


Represented programatically;
```py
# Distribution checker (see BreedingAlgorithm/boxutils.py - combinate())
valid = True
for index in range(1, len(comb)):
    if sum(comb[0:index]) < (2**(index-1)):
        # Broke rule - distribution is invalid
        valid = False
if valid:
    # Followed rule - distribution is valid
```

This is easier to visualize by taking the spikiest distribution for the target level and treating each slot as it is full of water according to the number of breeders in that slot.

The spikiest distribution is unstable as the water level is uneven, and since *water only flows downward*, every valid distribution is generated as the water comes to rest at the most even state.

![Water visualization](https://i.imgur.com/QWVxDfI.png)

After permutation, generation of all distributions falls (about) under O(n!).

For more details on programatic distribution generation, see `combinate()` within `BreedingAlgorithm/boxbreedutils.py`

### Tree generation
Tree generation takes all the distributions generated for a target level, and converts them into tree skeletons.

Treegen starts by iterating through each level of the skeleton tree dictated by the number of targeted IVs, as that is proportionate to levels.

The treegen algorithm traverses the binary tree from one below top of the tree downwards, starting by assigning the target breeder at the top

![Binary tree example + treegen direction](https://imgur.com/XYI5E7H.png)

As it traverses downwards, it looks one level above the level it is currently on, and splits the Pokemon's IVs above it according to distribution popularity (prioritize the highest stat in the distribution), and adds them on the current level. As they are being added, if a placeholder's IVs match one of the user's Pokemon, that Pokemon is assigned instead of a placeholder.

Breeders are not split as that would not make sense, but empty slots are added below to retain tree structure. 

If splitting a slot from above results in two potential breeders below, they are evaluated for compatibility, and if they are not compatable the second breeder is replaced with a placeholder.

![Breeder split compat check](https://i.imgur.com/gz2JXac.png)

Scoring is currently done through the equation n^2.08 where n is the number of remaining breeders left. The additional .08 is added to compensate for power item prices as well as the additional miscellaneous costs. This is graphed below relative to n^2 which represents absolute cost in terms of breeder count.

![Compensation scoring vs absolute](https://imgur.com/ftiIHVy.png)

As of now, tree generation falls under (about) O(1) with distributions. This is fine, but since input is O(n!), it makes sense to optimize here. A goal is to hopefully reduce input to the algorithm through distribution pruning.


Treegen returns the tree with the highest score found, JSONified.

### Diagram
```
       ____________________________________________
      |Frontend - React + Node served through NGINX|
+--------------------------------------------------------+
|                                                        |
| 1. Choose target -> Enter breeders -> Submit form - || |
|                                                     \/ |
|         \/------------------------------------------<  |
| 2. POST to NGINX                                       |
|         \/                                             |
| 3. NGINX reverse proxy -> Gunicorn -> Flask            |
|         ||    ________________________                 |
|         ||   |Backend - Python + Flask|                |
|  +------\/------------------------------------------+  |
|  | 4. Data preprocessing                            |  |
|  |      \/                                          |  |
|  | 5. Distribution generation through combinations  |  |
|  |      \/                                          |  |
|  | 6. Generate all trees from distributions         |  |
|  |      \/                                          |  |
|  | 7. Choose best fitting tree, or stop on perfect  |  |
|  |      \/                                          |  |
|  | 8. Assign breeders to tree                       |  |
|  |      \/                                          |  |
|  | 9. Assign items to tree, JSONify                 |  |
|  |     \/                                           |  |
|  | 10. Return tree, remaining breeders              |  |
|  +-----\/-------------------------------------------+  |
| 11. Retrieve response                                  |
|        \/                                              |
| 12. Render tree, items, remaining breeders             |
|                                                        |
+--------------------------------------------------------+
```
Note: This is wildly oversimplified, especially step 6 and 12.

## Contributing
Contributions are done through pull request. Allow at least a week for code review.

## Acknowledgments
EggplantHero - All frontend work, algorithm designing

wcshamblin - Algorithm designing,  Python + Flask backend, README