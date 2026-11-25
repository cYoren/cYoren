<p align="center">
  <picture>
    <source srcset="assets/banner.webp" type="image/webp">
    <img alt="ASCII fluid animation, rendered by the ASCII Paper engine" src="assets/still.png" width="100%">
  </picture>
</p>

I'm Gustavo, a physician in Brazil, moving to Niedersachsen for neurology.

Most of what I write is software for a shift: a self-hosted tracker for my own symptoms, a reader that paces me through an epub, an engine that draws a whole screen with ASCII. When a tool I use every day gets in my way, I send a patch back to its repository. All of the code here is open source.

## Contributing to

- **[react-pdf](https://github.com/diegomura/react-pdf)**: a checkbox wrote its value as a literal string, `/V (/Yes)` instead of `/V /Yes`, so any reader that did not draw from `/AS` saw an unchecked box ([#3624](https://github.com/diegomura/react-pdf/pull/3624), merged).
- **[OpenNext for AWS](https://github.com/opennextjs/opennextjs-aws)**: `afterFiles` and `fallback` rewrites stopped at the first match, so a rule whose destination matched a later rule never ran ([#1362](https://github.com/opennextjs/opennextjs-aws/pull/1362), open).
- **[OpenCode](https://github.com/anomalyco/opencode)**: punctuation went out with the virtual key code of a navigation key, so `.` reached the page as Delete ([#65555](https://github.com/anomalyco/opencode/pull/65555), open); a shell that exited just after its timeout still reported itself as backgrounded ([#63781](https://github.com/anomalyco/opencode/pull/63781), open).
- **[Omarchy](https://github.com/omacom/omarchy)**: `OMARCHY_PATH` quoted in the function loader glob, and the ASCII Paper wallpaper offered as an optional installer ([#12456](https://github.com/omacom/omarchy/pull/12456), [#12459](https://github.com/omacom/omarchy/pull/12459), both open).

## Building

- **[Datalyst](https://github.com/cYoren/datalyst)**: symptoms, sleep, mood, habits and money logged in a few seconds a day, then n-of-1 experiments with randomized schedules and power analysis. Self-hosted and MCP-ready.
- **[Licitações MCP](https://github.com/cYoren/licitacoes-mcp)**: read-only MCP server over PNCP and Compras.gov.br open data, with tools for finding a tender, reading its details and comparing prices.
- **[Speedready](https://github.com/cYoren/speedready)**: pacer and RSVP reader for epubs, with the translation sitting above every word you have not marked as learned. GTK4, plus a [web version](https://speedready.vercel.app).
- **[usbless-dualboot](https://github.com/cYoren/usbless-dualboot)**: installs Windows next to Linux using the internal SSD as the installer, shrinking LUKS, Btrfs or ext4 in place and putting the boot menu back.
- **[Puzzlestack](https://github.com/cYoren/Puzzlestack)**: one-minute logic, math, memory, spatial, attention and word puzzles dealt as a deck, in Flutter, on desktop, web and mobile.

## Research

- **[scfc](https://github.com/cYoren/SC-FC_coupling)**: structural and functional connectivity both shrink with distance, so a per-region coupling score can be large when function does not depend on structure at all. A synthetic benchmark with a known ground truth, then a preregistered two-dataset test.
- **[Awesome Hands-on Neuroscience](https://github.com/cYoren/awesome-hands-on-neuroscience)**: runnable notebooks, from spiking neurons to whole-brain imaging, written so someone without a neuroscience background can start.
- **[Dichotic listening trainer](https://github.com/cYoren/Dichotic-audio)**: a different track in each ear plus masking noise and difficulty presets, for training with CAPD and ASD. The audio stays in the browser.
- First author on a case report about endocrinopathies from pembrolizumab, in the *Brazilian Journal of Case Reports*: [doi:10.52600/2763-583X.bjcr.2025.5.1.bjcr15](https://doi.org/10.52600/2763-583X.bjcr.2025.5.1.bjcr15).

## After hours

- **[ASCII Paper](https://github.com/cYoren/asciipaper-engine)**: one GLSL `cell()` function rendered once per character, so a full screen of glyphs costs about as much as one quad. A Wayland live wallpaper in C, the same shaders in WebGL, plus video, GIFs and stills. [Run it in a browser](https://cyoren.github.io/asciipaper/).
- **[exoself](https://github.com/cYoren/exoself)**: a temperament for agents drawn from one 32-byte seed and expanded deterministically, so the same seed gives the same agent in any implementation. Python and Rust that agree, listed in the [Hermes plugin catalog](https://github.com/NousResearch/hermes-agent).
- **[dotfiles](https://github.com/cYoren/dotfiles)**: Omarchy 4 and Hyprland on a Dell G15, a glassy Quickshell bar, compositor plugins built from source, and the ASCII Paper engine as the wallpaper layer.

## What's next

ASCII Paper is heading for the community: a pack is a shader plus a spec file, so a wallpaper someone writes can run on every platform the engine already reaches. Datalyst is moving toward hosted studies, where a protocol is preregistered with a frozen hash, participants join through a consent link, and the pattern I found in my own data gets tested by someone else. Both are meant to outgrow what I need from them.

<p align="center">
  <a href="https://github.com/cYoren">GitHub</a> ·
  <a href="https://linkedin.com/in/gustavo-marcelino-443532109">LinkedIn</a> ·
  <a href="https://orcid.org/0009-0000-8283-1737">ORCID</a> ·
  <a href="mailto:gustavo.cesar.marcelino4@gmail.com">email</a>
</p>

<sub>The banner is a recorded loop of the engine, made by <a href="tools/record-banner.mjs"><code>tools/record-banner.mjs</code></a>.</sub>
