document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('container');
    const start_page = document.getElementById('start_page');
    const Qcontainer = document.getElementById('question-container');
    var resultpage = document.getElementById('resultpage');
    const prevbut = document.getElementById('prev_but');
    const nextbut = document.getElementById('next_but');
    const MarksBoard = document.getElementById('MarksBoard');
    var Qarray = [];     // array to declare questions indexes
    var myXML;
    var userscore = 0;
    var attemptedQ = 15;
    var passmarks = 0;
    var marksperQ = 0;
     
    var Qcounter = 0;
    // shuffle the Qarray
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [array[i], array[j]] = [array[j], array[i]];
        }
    }
 

//fetching xml directly in global scope
   fetch('assessment.xml')
     .then(response => response.text())
     .then(str => { 
        const parseMe = new DOMParser();
        myXML = parseMe.parseFromString(str, 'text/xml');
        let questions = myXML.getElementsByTagName('question');
        passmarks = myXML.getElementsByTagName('passmarks')[0].textContent; 
        marksperQ = myXML.getElementsByTagName('marks')[0].textContent;
        console.log(passmarks,marksperQ);
        for(let i=0;i<=questions.length-1;i++){Qarray.push(i)};
        shuffle(Qarray);
     })
     .then(alert('document loaded'))
     .catch(error => console.error('Error fetching the XML:', error));

    

//  start the assessment
document.getElementById('start_assess').addEventListener('click',function(){
     container.style.display="block";
     MarksBoard.style.display='flex';
     start_page.style.display='none';
     shuffle(Qarray);
     console.log(Qarray);
     Qcounter++;
     showQ();
});
    
 
//show questions

function showQ(){
    var myQDetails = "";
      for(let i=0;i<15;i++){
        let myQue = myXML.getElementsByTagName('question')[Qarray[i]];
        let Qtext = myQue.getElementsByTagName('text')[0].textContent;
        let option1 = myQue.getElementsByTagName('option')[0].textContent;
        let option2 = myQue.getElementsByTagName('option')[1].textContent;
        let option3 = myQue.getElementsByTagName('option')[2].textContent;
        let option4 = myQue.getElementsByTagName('option')[3].textContent;
  
        myQDetails += `<div id="questions" class="Qnum${Qcounter} hidden">
                         <div id="question"> <span id="Qcounter">${Qcounter}</span> ${Qtext}</div>
                         <div id="options">
                            <span><input type="radio" name="QN${Qarray[Qcounter-1]}" value="0" > ${option1}</span> <br>
                            <span><input type="radio" name="QN${Qarray[Qcounter-1]}" value="1" > ${option2} </span> <br>
                            <span><input type="radio" name="QN${Qarray[Qcounter-1]}" value="2" > ${option3}</span> <br>
                            <span><input type="radio" name="QN${Qarray[Qcounter-1]}" value="3" > ${option4}</span>
                         </div>
                     <button id="submit${Qarray[Qcounter-1]}" class='submitbut'>Submit</button>
                 </div>`;
        Qcounter++;
    }
      Qcontainer.innerHTML = myQDetails; 
      

      showfive(a,b);
}

document.addEventListener('click', function (e) {
     
    if (e.target && e.target.classList.contains('submitbut')) {
        let buttonId = e.target.id;
        const QN = buttonId.replace('submit', '');
       
        let myQue = myXML.getElementsByTagName('question')[QN];
        let xmloptions = myQue.getElementsByTagName('option');
         
        let o0 = xmloptions[0].getAttribute('correct');
        let o1 = xmloptions[1].getAttribute('correct');
        let o2 = xmloptions[2].getAttribute('correct');
         
        let ca;
        if(o0=='true'){ca = 0}else if(o1=='true'){ca=1}else if(o2=='true'){ca=2}else{ca=3}
         
         
        let SO = document.querySelector(`input[name="QN${QN}"]:checked`);
        let SV = SO.value;
         
        if(SV==ca){
             userscore += parseInt(marksperQ,10);
             alert('Your answer is CORRECT');
          } else{
            alert('Your Answer is INCORRECT');
          }

        finalscore(userscore);
          //disabling button
          e.target.disabled =true;
          e.target.textContent = "answer submited";
          e.target.style.background = 'grey';
         }
    
});

function finalscore(n){
    attemptedQ -= 1;
    document.getElementById('Qleft').innerHTML = `Pending <br> ${attemptedQ}`;
    document.getElementById('Qright').innerHTML = `Attempted <br> ${15-attemptedQ}`;
    document.getElementById('totalMarks').innerHTML = `Marks<br> ${userscore}`;

    if(attemptedQ == 0){
        container.style.display = 'none';
        MarksBoard.style.display='none';
        resultpage.style.display = 'block';
          (n>=passmarks) ? resultpage.innerHTML = `You have successfullt passed <br> the assessment <br> ${userscore} / 75 marks <div>Refresh the page to start again</div>` : resultpage.innerHTML = `You have failed <br> the assessment <br> ${userscore} / 75 marks <div>Refresh the page to start again</div>`;
    }
    
}

//show only five items per page
let a = 0;
let b = 5;
let Qperpage = 5;
 
function showfive(a, b) {
    let divs = Qcontainer.querySelectorAll('#questions');
    divs.forEach(div => {
        div.classList.add('hidden');
    });

    for (let i = a; i < b; i++) {
        const questionset = document.getElementsByClassName('Qnum' + (i+1));
        for (let j = 0; j < questionset.length; j++) {
            questionset[j].classList.remove('hidden');
        }
    }
}

prevbut.addEventListener('click', function() {
    if (a > 0) {
        a -= Qperpage;
        b = a + Qperpage;
        showfive(a, Math.min(b, Qarray.length)); // Ensure `b` doesn’t exceed the total number of items
    }
});

nextbut.addEventListener('click', function() {
    if (b < Qarray.length) {
        a += Qperpage;
        b = a + Qperpage;
        showfive(a, Math.min(b, Qarray.length)); // Ensure `b` doesn’t exceed the total number of items
    }
});




});