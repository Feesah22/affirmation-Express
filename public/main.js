const heart = document.getElementsByClassName("fa-heart");
const typo = document.getElementsByClassName("fa-trash")




  Array.from(heart).forEach(function (element) {
     element.addEventListener('click', function () {
      // console.log(this.parentNode.childNodes[3].innerText)
       const emotion = this.parentNode.parentNode.childNodes[1].innerText
       const affirmation = this.parentNode.parentNode.childNodes[3].innerText
       fetch('favoriteAffirmation', {
         method: 'put',
         headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        'feeling': emotion,
          'text': affirmation,
           'complete': true,
          
         })
       })
         .then(response => {
           if (response.ok) return response.json()
         })
         .then(data => {
           console.log(data)
           window.location.reload(true)
         })
     });
   });

Array.from(typo).forEach(function(element) {
      element.addEventListener('click', function(){
       //console.log(this.parentNode.parentNode.childNodes)
        const emotion = this.parentNode.parentNode.childNodes[1].innerText
        const affirmation = this.parentNode.parentNode.childNodes[3].innerText
        
        fetch('deleteAffirmation', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'feeling': emotion,
            'affirmationText': affirmation,
          })
        }).then(function (response) {
          window.location.reload()
        })
        });
 });

