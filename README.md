# hawthorne
my base grunt project

- zapo


## getting started
'''cd''' to the '''src/''' directory and run '''grunt watch'''.
the site will get built in the '''build/deploy''' directory.




### what it does..
- compile my sass √
  grunt-contrib-compass

- watch for changes √
  grunt-contrib-watch

- copy over files √
  grunt-contrib-copy

- compile my JS √
  yui-compressor


### included:
- font awesome
(jquery to be added)




##### in the works
- clean
why include it? let's say we mis-name a file: exmaple.json.
and let's say we didn't catch the initial mistake.
if you work with that file while grunt is running then it will copied over to the debug folder. for the json example it would be 'build/debug/data/exmaple.json'
once we correct the mistake the correct file will be copied over but we will still have that mis-named json file. clean would make sure the directory we are delivering to is clean of any files that shouldn't be there.

- clear
- doccoh
