# Antigravity skills pack (2026-11-02)

Seven vetted skills (all from ✅ Pass entries in the Tool & Repo Library), downloaded 2026-11-02 from the official GitHub repos:
- ponytail (DietrichGebert/ponytail): smallest change that works; short, reviewable code.
- frontend-design (anthropics/skills): bold, non-template visual direction and typography.
- emil-design-eng (emilkowalski/skills): UI polish rulebook (shadows, spacing, components, motion).
- animate (emilkowalski/skills): builds each animation with the right easing, timing and properties.
- break-ui (emilkowalski/skills): stress-tests pages with worst-case content (long names, empty states).

- taste-skill (Leonxlnx/taste-skill): art direction, real pictures, checks its own pages. Re-checked 2026-11-02.
- ui-ux-pro-max (nextlevelbuilder/ui-ux-pro-max-skill): searches a local design database for style, colours, fonts. Re-checked 2026-11-02.

The first five are plain text. The last two run small local scripts:
- taste-skill needs Node.js. Its scripts may download free-licence pictures (Openverse, Wikimedia, museums, NASA) and open a hidden Chrome window with a blank temporary profile to check pages. It saves a small history file in your user folder (.taste-skill).
- ui-ux-pro-max needs Python 3. Its script only reads its own data files. One change made: its file paths were rewritten from Claude's plugin folder to .agents/skills/ui-ux-pro-max/.
With Request Review on, Antigravity asks you before running any of them.

Our rules beat the skills' defaults: fonts are self-hosted (no Google Fonts links), and no new packages without asking.

## Install (per project)
1. Unzip so the `.agents` folder sits at the TOP of the project folder (next to package.json).
   Result: <project>/.agents/skills/ponytail/SKILL.md and <project>/.agents/skills/emil-design-eng/SKILL.md
2. Open that project folder in Antigravity IDE (Open Folder).
3. Start a new chat in the agent panel and ask: "Which skills can you see?" It should list both.
