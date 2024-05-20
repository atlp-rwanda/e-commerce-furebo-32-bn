__Steps to Configure ESlint and Pre-commit Hooks in your local repository__<br>

Open Your Git bash and run the following commands<br>

1.```npx husky install ``` <br>
To add the .husky Directory

2.After that, navigate to the __.husky__ directory which has been Added and add this piece of code to the __pre-commit__ file:<br>

```
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run ESLint with --fix option to format code
npx eslint --fix .

# Run tests
npm run test

``` 
<br>

3. ```chmod +x .husky/pre-commit``` <br>
To Make the pre-commit file executable


__note: The above commands has to be run in the Git Bash, not Powershell Terminal__