# Little Template Maker

Hi! I'm Joel and I got tired of creating the same file structure everytime I made a new component. To solve that hassle I made the Little Template Maker. Your lean mean templating machine. 

## Make it happen

   1. Hit `Cmd+P` and write "`Little Template Maker`".
   2. Pick your template and follow the guide.

### Guide
#### Steps
1. Pick a template
1. Pick an existing folder 
1. Optionally add the name of a new child folder to add the template into
1. Loop thru template variables and assign them
1. 💃🕺🍦 Enjoy your new files   
## Create templates
When you run the command the first time it creates a `/.templates` folder in your project. Within that folder you build your template with `.handlebars` files. 

### Some ground rules
1. Each template must be a child directory of `/.templates`
1. Use Handlebars syntax for creating variables, like so "`{{allYourBaseAreBelongsToUs}}`"
1. Within a template you can use folders, files, all the good stuff.
1. The Little Template Maker will strip all `.handlebars` files of their extension. If you want your generated file to be named `Component.tsx` the template filename should be `Component.tsx.handlebars`.

