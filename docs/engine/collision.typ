#pagebreak()

== Collision System

The repetitive background music likely takes the number one spot as far as things which made the Cartoon Cartoon Summer Resort games memorable. The second place spot for most memorable feature can safely be given to the game's collision detection system.

The average player has undoubtedly come across Cartoon Cartoon Summer Resort's questionable collision system after spending some time playing the game.
The collision system often seems illogical and random, which leads to confusion and frustration among players.

Normally, objects that look like you can't walk on them don't let you walk on them. For example, trees, shrubs, and buildings are examples of objects that logically should have collision,
and most of the time this is true.
But as you may have experienced, there are #underline([many]) examples where this is not true.

Here are a few visual examples from just the first episode which are particularly egrigious. Game screenshots are shown on the left, and their corresponding collision maps are shown on the right (collision screenshots are taken from Map-o-Matic-v2, the map editor I made).
Red areas are non-walkable and have collision, while green areas are walkable and do not have collision.
Sorry for the readers who are red-green colorblind, as if it couldn't be confusing enough already.

#grid(
  columns: (50%, 50%),
  row-gutter: 3%,

  image("collision/bad-1.png"),
  image("collision/bad-1-coll.png"),

  image("collision/bad-2.png"),
  image("collision/bad-2-coll.png"),

  image("collision/bad-3.png"),
  image("collision/bad-3-coll.png"),

)

When we look at the game screenshots on the left without considering the collision maps on the right,
it looks totally absurd.
The player character is climbing on the roofs of buildings, over shrubs, palm trees, and in the middle of areas that look like they should be completely out of bounds.

The bounds are a lot more clear when we look at the collision maps, but it still doesn't make sense as to why those specific areas are walkable while others aren't.
Why is there no collision in these areas?
There are 3 simple causes which account for almost all of the broken collision detection.

Despite the seemingly complicated and illogical collision consistency, the collision system is surprisingly very logical and  consistent.
It just needs to be understood to be used effectively.
The real problem with the collision system is that it is not very intuitive, but once you understand it, it's impossible to mess things up.


=== The Three Causes of Broken Collision

Here are the three causes of broken collision, we will go through each one by one, in the order of least complicated to most complicated. As far as I'm aware, these three causes make up the entirety of the glitchy collision in the games.

+ *Bad Map Connections* -- a walkable part of a map connects to an unwalkable part of a neighboring map
+ *Incorrectly Typed Objects* -- Objects are incorrectly marked as `FLOR` (walkable) instead of `WALL` (non-walkable)
+ *`FLOR` Overlap* -- Objects are ordered incorrectly in the map data.


==== 1. Bad Map Connections

This is the simplest to understand cause of bad collision.
A bad map connection as a spot on a map which is walkable, and by walking on it and walking into a neighboring map,
the player is panned over and glitched into a non-walkable area on the new map.

Consider the following area:

#grid(
  columns: (50%, 50%),
  column-gutter: 3%,
  image("collision/connection-1.png"),
  image("collision/connection-2.png")
)

In the image on the left, from episode 1,
we can see that the bottom map has a walkable grassy space
above the shrubs which are beside the building.
If we were to align the player on that tile, and walk upwards,
the player would be panned into the above map.
The spot directly above in the top map is occupied
by a palm tree, which has collision detection.
This results in the player being stuck in the palm tree if he enters the map from below it.
In cases like this, the player is almost softlocked, but can usually always escape by going in the reverse direction that he came in by returning to the previous map.

Comparing the first image from Episode 1 on the left with the right image from Episode 2, we can see that the developers intentionally extended the flowers to now block that area, most likely because they recognized this issue after releasing the first game and it's simple to fix.

This can be avoided by always making the tiles which border each other between maps have the same type.
A walkable tile at the edge of one map should always
lead to a walkable tile on the neighboring map,
and likewise for non-walkable tiles.
This bug happens when you walk into a non-walkable tile.


This cause of bad collision is simple to understand, and comes down to bad map design.
It seems like this type of issue didn't happen too often in practice.
Here is another example which existed in Episodes 1 & 2, but the developers fixed in Episode 3:

#image("collision/connection-3.png")
#image("collision/connection-4.png")

We can see that there is a grass tile which borders on a palm tree, but this was fixed in episode 3 by removing the two palm trees from the map on the right.
Virtual deforestation!

==== 2. Incorrectly Typed Objects

The second reason is due to game objects having the incorrect collision type.
This is also easy to understand.

==== 3. `FLOR` Overlap


