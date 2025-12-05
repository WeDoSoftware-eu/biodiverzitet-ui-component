# biodiverzitet-ui-component
UI components for the Biodiverzitet / Sync Ecology application

## Use of library

### Styles
Add following in styles.scss of consuming app:
```
@use '@angular/material' as mat;
@use "ngx-eco-theme/styles/green-theme" as m3;

@include mat.core();


:root {
  @include mat.all-component-themes(m3.$light-theme);
  @include mat.system-level-colors(m3.$light-theme);
  @include mat.system-level-typography(m3.$light-theme);
}

html, body { height: 100%; }
body { margin: 0; font-family: Roboto, "Helvetica Neue", sans-serif; }
```

### Development
#### Use linking to consume library by:
- Calling build for particular project.
- Calling link script for particular project. E.g. "<code>cd ../../dist/ngx-eco-theme && npm link</code>".
- Optionally, calling pack script for particular project and installing lib from generated file. Generated tarballs should be outputted in "bin" folder, that is ignored by git.
- Created script with watch: npm run link:local
- Calling link function in consuming app. E.g. "<code>npm link ngx-eco-theme</code>".

#### Notes:
- you may need to delete .angular file in order for changes to take effect.
- you need to include exported styles from library in consuming app angular.json -> projects.[project_name].architect.build.options.styles. Like:
```
"styles": [
  "node_modules/ngx-eco-theme/styles/green-theme.scss",
  "src/styles.scss"
],
```
- If you want to use symbolic links, make sure you added <code>"preserveSymlinks": true</code> in angular.json -> projects.[project_name].architect.build.options

#### Component development
You can use sample UI app [eco-theme-sample] for quick visualization of component during development.
