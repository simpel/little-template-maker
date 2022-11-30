# Little Template Maker

Hi! I'm Joel and I got tired of creating the same file structure everytime I made a new component. To solve that hassle I made the Little Template Maker. Your lean mean templating machine. 

## Make it happen

   1. Hit `Cmd+P` and write "`Little Template Maker`".
   2. Pick your template and follow the guide.

## Create templates
When you run the command the first time it creates a `/.templates` folder in your project. Within that folder you build your template with `.handlebars` files. 

### Some ground rules
1. Each template must be a child directory of `/.templates`
1. Use Handlebars syntax for creating variables, like so "`{{allYourBaseAreBelongsToUs}}`"
1. Within a template you can use folders, files, all the good stuff.
1. The Little Template Maker will strip all `.handlebars` files of their extension. If you want your generated file to be named `Component.tsx` the template filename should be `Component.tsx.handlebars`.


## Caveats
Currently you can only place templates in existing folders. This kind of sucks and will be fixed, in the meantime just remember to create your destination folder before you use Little Template Maker.