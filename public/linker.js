  
let {PythonShell} = require('python-shell')
var path = require("path")


function get_weather() {

  
  
  const options = {
    scriptPath : path.join(__dirname, '../../engine/'),
    args : []
  }

  let pyshell = new PythonShell('run.py', options);
  
//   pyshell.send('hello');
 
  pyshell.on('message', function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    console.log(message);
  });
   
//   // end the input stream and allow the process to exit
//   pyshell.end(function (err,code,signal) {
//     if (err) throw err;
//     console.log('The exit code was: ' + code);
//     console.log('The exit signal was: ' + signal);
//     console.log('finished');
//   });
  
}