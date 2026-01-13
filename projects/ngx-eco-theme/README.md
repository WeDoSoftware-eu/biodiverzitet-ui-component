# NgxEcoTheme

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.0.

## Code scaffolding

Run `ng generate component component-name --project ngx-eco-theme` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project ngx-eco-theme`.
> Note: Don't forget to add `--project ngx-eco-theme` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build ngx-eco-theme` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing - locally
Create personal access token (PAT) with permission `write:packages` from `https://github.com/settings/tokens`.

Login to WeDoSoftware-eu registry by calling `npm login --scope=@WeDoSoftware-eu --auth-type=legacy --registry=https://npm.pkg.github.com/WeDoSoftware-eu`. Use your GitHub name and created PAT as your password.

Call `version-patch` script to update version, then build the package.
After building your library, go to the dist folder `cd dist/ngx-eco-theme` and run `npm publish`.

### Publishing - release
At time of writing, script `npm-publish-github-packages.yml` fails to publish due to authorization. Possible issue is that `registry-url: https://npm.pkg.github.com/` needs to be `registry-url: https://npm.pkg.github.com/WeDoSoftware-eu`.

## Running unit tests

Run `ng test ngx-eco-theme` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
