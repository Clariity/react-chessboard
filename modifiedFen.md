# Modified FEN

I have introduced a FEN string modification to support my requirement of an
expanding board.

## Requirements

- The board should be able to expand from the original 8x8 board 1 square at a
  time
- Pieces should be able to occupy any of the newly created squares

## Solution

Normal FEN looks like this

```
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
```

I have introduced a few new special characters

| Character | Description                                                                                                                        |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| #         | This character should show up at the starting of the row defining the 8th rank                                                     |
| $         | This character should show up before the character on the a file                                                                   |
| E         | This character simply a non existent square. The purpose of this character is to disambiguate square with no piece and empty space |

## Examples

### Board with 1 row as the 9th rank

```
8/#rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
```

### Board with 1 row as the 0th rank

```
#rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/8
```

### Board with a file before the a file

```
#1$rnbqkbnr/1$pppppppp/1$8/1$8/1$8/1$8/1$PPPPPPPP/1$RNBQKBNR
```

### Board with a file after the h file

```
#$rnbqkbnr1/$pppppppp1/$9/$9/$9/$9/$PPPPPPPP1/$RNBQKBNR1
```

### Board with a few squares added on top of 8th rank

```
2EEEEE2/#rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
```
