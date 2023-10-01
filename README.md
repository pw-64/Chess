# Chess
A very basic web-app implementation of chess.
Pieces have their basic move-set:
- Pawn: forwards one (two if at starting row) and can take forwards diagonally
- Knight: L shaped moves
- Bishop: diagonally
- Castle / Rook: vertical and horizontal
- King: 1 space in any direction
- Queen: any number of spaces in any direction

"Any direction" means directly vertical, horizontal or diagonal.

The goal is to take the other player's king while preventing them from taking yours. There are a lot of different playstyles and move combinations, so it may be useful to watch [some examples on YouTube](https://www.youtube.com/results?search_query=basic+beginner+chess+examples+tutorial) if you are a beginner.

## Information & Usage
As with my other basic webapp projects, all of the dependencies are included - you just need to run `./start.sh` to open it.

## Legal & Credits
Credit to [Lichess](https://github.com/lichess-org/lila) for the pieces images. The set used in this project are found [here](https://github.com/lichess-org/lila/tree/master/public/piece/libra); Credit to sadsnake1 for this set (from [here](https://github.com/lichess-org/lila/blob/master/COPYING.md#exceptions-free)).

Under the [terms of that license](https://creativecommons.org/licenses/by-nc-sa/4.0/) I am free to:
- Share (therefore they are included in this repo)

And I must:
- Be Non-Commercial - this project is FOSS and I therefore make no money from it
- Give Attribution - I have credited both Lichess and sadsnake1, the original creator, above; I have also linked to any licenses I found
- Share-Alike - This project uses the AGPL-3.0 license, the same as Lichess, and the images are shared in this repo under the same license (CC BY-NC-SA 4.0 DEED) as the original creator

If there are any issues with copywrite or licenses, please open an issue and I should respond within a week, assuming nothing out of the ordinary has happened to me.
