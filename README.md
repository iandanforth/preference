# Softmax Action Detection Visualization

[Visualization Demo](https://iandanforth.github.io/smaction/)

[Description of Softmax Action Selection](http://www.incompleteideas.net/book/ebook/node17.html)

The impact of temperature (tau) in the softmax equation on the probability of an action being selected may not be immediately obvious.

This visualization is a simple way to see that impact.

### Things to try

 - Set temperature = 1
     - Set the value of 'a' near the value of 'b'. Notice how small changes in value in this regime have large impacts.
     - Set temperature to 1000 and try again.
 - Try to fully recover the equiprobable action selection policy.
 
