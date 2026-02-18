# Icons

Previous versions can be found on [sharepoint](https://wedosoftwareeu.sharepoint.com/sites/EKO-BIODIVERZITET/Shared%20Documents/Forms/AllItems.aspx). At the time of writing, exact location is [here](https://wedosoftwareeu.sharepoint.com/sites/EKO-BIODIVERZITET/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FEKO%2DBIODIVERZITET%2FShared%20Documents%2FGeneral%2FBIODIVERZITET%2FIkonice&viewid=31d3c2a0%2D8cd8%2D4d06%2Dbe11%2D10f5a049b6b7&newTargetListUrl=%2Fsites%2FEKO%2DBIODIVERZITET%2FShared%20Documents&viewpath=%2Fsites%2FEKO%2DBIODIVERZITET%2FShared%20Documents%2FForms%2FAllItems%2Easpx).

## Font generation

Fonts are generated via [IcoMoon](https://icomoon.io/new-app), free online/offline tool.

### IcoMoon Configuration

Configuration for exporting icons is as follows:

- Order icons alphabetically
  - Batch -> Metadata tab -> Rearrange Glyphs -> Sort by Name
- Export config (Export -> Export tab)
  - Font
    - Font Family -> "EcoIcons"
    - Web font and CSS -> true
  - CSS
    - Class -> "icon"
    - define property per glyph -> true
    - Define class per glyph -> true
      - prefix -> "eco-icon-"
  - SVG
    - fixed size -> true
      - size -> 32

After generating new icon font, update [EcoIcon](/projects/ngx-eco-theme/src/lib/icon/icon.component.ts) with new icon names. And format them in order.

To order icon names in VS Code (Windows), select all names -> `Ctrl + Shift + P` -> `Sort lines ascending`.

## Known issues

Icon for meter squared is broken. We should use HTML `<code>m<sup>2<sup></code>` (produces <code>m<sup>2<sup></code>) instead.
