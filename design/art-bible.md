# Vườn Chữ: Art bible

Made following the Claude Code Game Studios art-direction form (`vendor/game-studios/.claude/genres/art-direction.md`).

- **Mood:** a sunny Vietnamese-feeling village from the old feature-phone social farm games: busy, friendly, a little nostalgic. The screen should feel like a place you hang out in, not a menu.
- **Camera and scale:** top-down 3/4 RPG view. Native tile 32 px, characters on 64 px frames (about 48 px tall). Render at whole-number scale only (2x on desktop, 1x or 2x on phones, chosen by viewport). Camera snaps to whole native pixels.
- **Shapes:** LPC proportions, slightly chunky people with readable heads; round bushy trees; soft-cornered terrain blobs; buildings are blocky wood and brick with pitched roofs.
- **Values:** characters and ripe crops carry the brightest values and strongest outlines. Ground stays mid-value and lower contrast so people read on top of it.
- **Palette:** taken from the LPC sources (grass greens, warm dirt, blue water, red brick, honey thatch). UI uses wood and parchment from the same sources plus one leaf-green accent. Shadows lean cool purple-brown, lights warm.
- **Detail:** faces, clothes and crops get the detail. Ground and roofs stay simple. HUD stays out of the play area except for name tags, speech bubbles and status icons.
- **Rules:** one pixel density (no mixed scales on one screen), image smoothing off everywhere, LPC dark outline on all sprites, no anti-aliased vector art drawn on top of the world. Text is the only non-pixel element.
- **Signature:** English signboards on every building and English speech bubbles over villagers, so the world itself is a reading lesson.
- **Avoid:** copying any existing game's characters, logos, maps or art. Emoji or font symbols as art. Procedural vector shapes standing in for sprites.

## Sources (all free, with attribution)

| Pack | Use | License |
|---|---|---|
| Universal LPC Spritesheet Character Generator | player and villager layers (body, head, eyes, hair, clothes, shoes, hats, glasses, tools) | per-file CC-BY-SA / OGA-BY / GPL, credits in `assets/credits.json` |
| LPC Base Assets | grass, dirt, water, trees, house walls, roofs, doors, windows, signs, bridges, barrels | CC-BY-SA 3.0 / GPL 3.0 |
| [LPC] Farming tilesets (Daniel Eddeland) | plowed soil, fences, sand, market stalls, produce, fish, boats | CC-BY-SA 3.0 / GPL 3.0 |
| [LPC] Crops (bluecarrot16 et al.) | crop growth stages | CC-BY-SA 3.0+ / GPL 3.0+ |
| [LPC] Farm (bluecarrot16) | barns, coops, sheds, silos | CC-BY 4.0 |
| LPC style farm animals (Daniel Eddeland) | chicken, cow, pig, sheep | CC-BY 3.0 / GPL 2.0 |
| [LPC] Cats and Dogs (bluecarrot16) | pets | CC-BY / CC-BY-SA / GPL / OGA-BY |

The game ships a Credits screen listing every author.
