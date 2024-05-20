## Rules for Naming Files and Folders/Directories

For specific files, we will be using dot notation with `element.action.ts`. For example:
- Controller: `element.controller.ts (Example: user.controller.ts)`
- Middleware: `element.middleware.ts (Example: user.middleware.ts)`
- Services: `element.service.ts (Example: user.services.ts)`
- Routes: `element.route.ts (Example: user.route.ts)`
- Test: `element.test.ts(Example: user.test.ts)`

### MODEL: FOR MODEL NAMING
- Model should be named as Entity in singular, models we will use dot notation eg. user.model.ts.
- Table name should be named as entity in plural and start with a lowercase letter.

### Utils
function in lowercase letters.

### In File Naming:
- Function: `camelCase` with a lowercase starting letter.
- Class: Capital `camelCase`


### Commits
Avoid creating more than one commit at any cost.

### Packages Installation
- Avoid installing type packages in dependencies; all of them need to be in `devDependencies`.
- Avoid installing packages that have not been maintained for longer than a year.