# Bracer

## Planned features

- Upstream breeding compat checking
- GTL breeding
- General quality of life improvements + bugfixes

## How it works

### Distributions
Distributions refer to the number of breeders in any one stat within a tree.

So, for example, in a 4x31 tree, a possible distribution is `4 2 1 1`, where 4 is the number of hp breeders, 2 is the number of atk breeders, and so on.

Distributions are assumed to be sorted with the highest value on the left, and follow the following order of stats:

`hp atk def spa spd spe`


#### Distributions follow a particular set of rules, as follows.
#### - Distributions length is equal to level l (where l is the number of targeted stats - for example 5x31 being l=5)

At l=4, distributions must have 4 individual numbers corresponding to each stat


#### - The spikiest (most uneven) distribution at any level l is represented by the following equation:

![Spikiest distribution equation](https://imgur.com/vZq1lxl.png)



#### - Distributions must sum to 2 to the power of the number of stats in the tree minus one
Assuming *D* is a set containing the distribution, this is represented by the following equation:

![Distribution rule equation 1](https://i.imgur.com/YK1I8M9.gif)



In a 5x31, there are 5 targeted stats. This means the sum of each distribution for a 5x31 must sum to `2^(5-1) = 16`.


8+4+2+1+1 = 16 - this distribution is valid

9+5+2+1+1 = 18 - this distribution is not valid

7+4+2+1+1 = 15 - this distribution is not valid



#### - Distributions cannot contain more than two 1s
Again assuming *D* is a set containing the distribution;

![Distribution rule equation 2](https://i.imgur.com/nJFyZNU.gif)

This is due to the way the binary tree shares IVs through the branches.
The two 1s are able to rest on the very outside edge of the base of the tree and pass upward, but there is no other space for another 1 to fit. (This does not mean distributions HAVE to contain two 1s)


#### - Assuming a sorted distribution where the leftmost value is the highest, for every slot of any distribution (excluding the first slot), the sum of the slots to the left must be less than 2 to the power of the slot index minus one.

Represented mathematically where *s* is the index of the current slot, this rule must apply to every *s* within any particular distribution;

![Distribution rule equation 2](https://imgur.com/ccZRXy8.png)


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

For more details on programatic distribution generation, see `combinate()` within `BreedingAlgorithm/boxbreedutils.py`

### Tree generation
Tree generation takes all the distributions generated for a target level, and converts them into tree skeletons.

Treegen starts by iterating through each level of the skeleton tree dictated by the number of targeted IVs, as that is proportionate to levels.

The treegen algorithm traverses the binary tree from one below top of the tree downwards, starting by assigning the target breeder at the top

![Binary tree example + treegen direction](https://imgur.com/XYI5E7H.png)

As it traverses downwards, it looks one level above the level it is currently on, and splits the breeders above it according to distribution popularity (prioritize the highest stat in the distribution), and adds them on the current level.

Breeders are not split as that would not make sense, but empty slots are added below to retain tree structure. 

If splitting a slot from above results in two potential breeders below, they are evaluated for compatibility, and if they are not compatable the second breeder is replaced with a placeholder.

Scoring is currently done through the equation n^2.08 where n is the number of remaining breeders left. The additional .08 is added to compensate for power item prices as well as the additional miscellaneous costs. This is graphed below relative to n^2 which represents absolute cost in terms of breeder count.

![Compensation scoring vs absolute](https://imgur.com/ftiIHVy.png)

### Diagram
```
               _______________________
              |Frontend - React + Node|
+--------------------------------------------------------+
|                                                        |
| 1. Choose target -> Enter breeders -> Submit form - || |
|                                                     \/ |
|         \/------------------------------------------<  |
| 2. POST to Flask API                                   |
|         ||    ________________________                 |
|         ||   |Backend - Python + Flask|                |
|  +------\/------------------------------------------+  |
|  | 3. Data preprocessing                            |  |
|  |      \/                                          |  |
|  | 4. Distribution generation through combinations  |  |
|  |      \/                                          |  |
|  | 5. Generate all trees from distributions         |  |
|  |      \/                                          |  |
|  | 6. Choose best fitting tree, or stop on perfect  |  |
|  |      \/                                          |  |
|  | 7. Assign breeders to tree                       |  |
|  |      \/                                          |  |
|  | 8. Assign items to tree, JSONify                 |  |
|  |     \/                                           |  |
|  | 9. Return tree, remaining breeders               |  |
|  +-----\/-------------------------------------------+  |
| 10. Retrieve response                                  |
|        \/                                              |
| 11. Render tree, items, remaining breeders             |
|                                                        |
+--------------------------------------------------------+
```
Note: This is wildly oversimplified, especially step 5 and 11.

## Contributing
Contributions are done through pull request. Allow at least a week for code review.

## Acknowledgments
EggplantHero - All frontend work, algorithm designing

wcshamblin - Algorithm designing,  Python + Flask backend, README