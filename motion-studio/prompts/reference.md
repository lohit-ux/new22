Reference: ./refs/[launch.mp4] (and/or ./refs/frames/*.png, or a folder of past work)

1. Extract one frame every 0.5s:  ffmpeg -i refs/launch.mp4 -vf fps=2 refs/frames/%03d.png   — study them.
2. Write ./docs/style_guide.md: palette (hex), type (family, weight, tracking), shot lengths,
   transition types, camera moves, texture/grain, how text enters and exits.
3. Write ./docs/shotlist.md for a [DURATION]s video about [SUBJECT] in THAT style, on the beat grid.
   Take the grammar of the reference, never its content, logos or characters.
4. Show me both files. Wait for my OK before any code.

Let the model pick the technique. Specify the look and the constraints, not the library.
Good reference sources: whatships.com (launch videos), Dribbble motion, competitors' launch films, our own past reels.
