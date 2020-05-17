let helpers = {
    convertDate(date, isTime) {
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hours = date.getHours();
        let mins = date.getMinutes();
        let secs = date.getSeconds();
      
        day = day.toString().padStart(2,'0');
        month = month.toString().padStart(2,'0');
        hours = hours.toString().padStart(2,'0');
        mins = mins.toString().padStart(2,'0');
        secs = secs.toString().padStart(2,'0');
      
        //let result = day + '.' + month + '.' + year;
        let result = year  + '-' + month + '-' + day;
      
        if (isTime) {
          //result += ' ' + hours + ':' + mins + ':' + secs;
          result += '-' + hours + '-' + mins + '-' + secs;
        }
      
        return result;
    },
    
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    
}

module.exports = {helpers}
  