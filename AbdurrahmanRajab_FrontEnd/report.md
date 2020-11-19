# Report of the coding task 

## Used Stack 

- Axios 
- NuxtJs
- typeScript
- javascript 
- VueJs
- Vuetify
- Jest 
- EsLint 

## Challenges 

### NuxtJS + Knawat SDK

Starting to use Knawat SDK immediately with nuxtJs was kind of challenging since the logic of the of knawat and nuxtjs is way different that cause to some errors - mentioned in the SDK repo.

Thinking that the SDK was working with nuxtJs made it hard to understand that the error caused becaues of compaitablity. after understanding that I Had to move to Axios and write some of the codes there.


### Knawat SDK 504 timeout error 

After writing the codes with axios and understanding the logic of the API, I faced a timeout error few times which lead me to create a lcoal DB to mimic the API and use it for the devlopment of the code! 

I used [JSon generator](https://next.json-generator.com/) to have a data that is similar to the API. 

### Testing 

Writing the test with async functions was kinda amusing and great thing to learn, I had a good time doing it, yet I wrote the mutations tests and skipped the snapshots for the time - it was like tests vs time of submission! 

## Evalution 

### Functionality 

#### what's done? 

The funtionality was written as what asked in the documentations - though I have had few modification for better UX, the responsivity was ensured by vuetify. 

### tests 

#### what's done? 

Have written the mutations tests. 
#### what's missing? 

skipped snapshots, action and store tests. 

### Git messages 

#### what's done? 

used a [semantic messages scheme](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)  with minor extension.


###  Other 

code style, code structure, project documentation, code linting, and ease of setup  is up to you! 
for the use of code you can do the nuxtJs instructions. 
