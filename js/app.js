
//GLOBAL VARIABLES

let listButton; //the button that shows or hides the nav menu
let headerBar; // the page progress bar
let screenHeight; //screen height
let Footer; //the footer element
let sections; //array of all section elements
let sectionsPos; //array of all absolute Y positions for every section
let activeSectionBox; //the fixed active section box at the mid right of the screen
let docBottomPos=0;   //variable that stores the last position at the document
let navSectionsLen; //the number of the buttons on the nav menu
let navSections; //the buttons on the nav menu
let navMenu; //the navigation menu
let upBtn; // button scrolls to the top or to the bottom of the page
let upIcon; // the icon of that button
let isListOpened=true; //boolean to check if the navigation menu is opened or closed
let isOpenable=true;  //boolean to check if the navigation menu can be opened or not
let timeoutVar=false;  // variable for storing a return value from setTimeout()
let canHide=true; //boolean to determine if the nav-menu can auto hide or show based on scrolling 
//***********************************************************************************






//HELPER FUNCTIONS

// 1) fucntion to get the position of every section
function getSectionsPos() 
{
  const sectionsPos=[]; //List for the Y-Axis Positions of every section element

  for ( let i=0; i< sections.length;i++)
  {
  //the position of the section in the document
  sectionsPos.push(sections[i].offsetTop - screenHeight*0.26) ;
  //offsetTop basically returns the position from the element to its nearest positioned parent
  //which is the body here 
  }
  return sectionsPos;
}


// 2) After clicking the top left button on the header this function gets called.
//this function simply show or hide the list by changing the display property.
//as well as rotating the top left button to show some kind of animation to make the page more dynamic.
function dropListFunc ()
{
  canHide=false;
  if (isOpenable)
  {
    if (isListOpened) {
      isListOpened=false;
      listButton.style.transform='rotate(90deg)';
      navMenu.style.display="none";
    }
      
      else {
        isListOpened=true;
        listButton.style.transform='rotate(0deg)';
        navMenu.style.display="flex";
      }
  }
}

// 3) function that scrolls to the top or to the bottom of the page
function scrollBtn()
{
  secIndex = Number(upBtn.dataset.section)-1;
  sections[secIndex].scrollIntoView(true);
}
//**********************************************************************************







//MAIN FUNCTIONS


// 1) Building the Navigation menu dynamically
function addNewNavSections() 
{
  /*Creating a documnet frag to to append all the added sections to it and then
  append the doc frag to the document. This is more efficient and more performant with a bigger project*/
  let docFrag=document.createDocumentFragment(); 
  const navSectionMenu= document.querySelector('.nav-menu').firstElementChild;
  sections.forEach(function(sec)
  {
    const newSectionButton=document.createElement('li'); //creating a list navigation item
    //adding the button to the list item
    newSectionButton.innerHTML=`<button id="list-btn" onclick="navToSection()" 
    name='section${navSectionsLen+1}'> <span class="button-text">${sec.dataset.nav}</span> </button> </li>`;
    navSectionsLen++;
    docFrag.appendChild(newSectionButton); //appending the each item to the frag
  });
  navSectionMenu.appendChild(docFrag); //append the frag to the document
}




/* 2) This function excutes whenever you click a button on the nav menu, Basically this function
scroll you to a specific section depending on the button you press*/
function navToSection ()
{

  let activeElem= document.activeElement;
  const elemNum=Number(activeElem.name.slice(7))-1; //getting the number of the section out of the name of the button
  sections[elemNum].scrollIntoView(true);

  //this line is for the progress bar at the header that shows where are you on the page
  //we get this bar and set the width to the percentage of the current position we are at 
  document.querySelector('#header-bar').style.width= (scrollY*100)/docBottomPos+1+"vw";  
}





/* 3) Here we are checking the current position of the viewport "scrollY" if it falls between 
one section and the section next to it. for example if the position of the current viewport falls between the position
the second section and the third one then the second section is active */
//we also are checking if the user is scrolling or not to show or hide the nav-menu
//this function excutes when we scroll.
function activeSection() 
{
  const currViewPos= window.scrollY+0.5; //the current position the user is currently viewing (viewport position)
  let start;
  let end;

  
  //console.log(currViewPos,'\n',...sectionsPos);

  for (let j=0; j< sectionsPos.length-1;j++)
  { 
      start=sectionsPos[j];
      end =sectionsPos[j+1];


      /*checking..... if true unhighlight all the secions and highlight that new active section in
      the nav menu and then break, if false go to the next iteration in the loop. */
      if (currViewPos >= start && currViewPos < end)
      {
        if (j==sections.length-1) //Showing the up button when at the bottom of the page (last section)
        {
        upIcon.style.transform="rotate(0deg)";
        upBtn.dataset.section="1";
        }
        else {
        upIcon.style.transform="rotate(180deg)";
        upBtn.dataset.section=""+sections.length;
        }


        for (let navSection of navSections)
        {
          navSection.style.borderLeft="0";//here unhighlighting all of them
          navSection.style.color="white";
        }
        navSections[j].style.borderLeft="5px solid lightblue";//highlighting the new one
        navSections[j].style.color="aqua";
        activeSectionBox.innerHTML=sections[j].dataset.nav;

        break;
      }
  }


  /*Showing the nav-menu when scrolling
  And hiding it when you are reading the content (when you are not scrolling)*/
  //Note you can cancel this feature by pressing the top left button at the header
  if (canHide) //if we canHide the nav-menu
  {
  navMenu.style.display='flex'; // show it when scrolling
  isListOpened=true;    
  clearTimeout(timeoutVar); //clearing the timeout if we scroll again to not show it then hide it
  timeoutVar=setTimeout(function() //timeout function to hide the nav-menu by 2.5 secs after we stop scrolling
  {
    navMenu.style.display='none';
    isListOpened=false;
  },1500);

  }

  else //if we cant hide the nav-menu
  {
    if (isListOpened)
    navMenu.style.display='flex';
    else
    navMenu.style.display='none';
  }

  //this line is for the progress bar at the header that shows where are you on the page
  //we get this bar and set the width to the percentage of the current position we are at
   headerBar.style.width= (scrollY*100)/docBottomPos+1+"vw";
}
//**********************************************************************************









//Event to start excuting the code when the DOM is ready to avoid crashes
document.addEventListener('DOMContentLoaded', function(){


//SETTING THE VARIABLES
upBtn=document.getElementById('up-btn');
upIcon=document.getElementById('up-icon');
listButton=document.querySelector('.fa-bars'); //the button that shows or hides the nav menu
headerBar=document.querySelector('#header-bar'); // the page progress bar
screenHeight=window.innerHeight;
Footer=document.querySelector('footer');
sections=document.querySelectorAll('section'); //array of all section elements
upBtn.dataset.section=""+sections.length;
activeSectionBox= document.getElementById('active-section-box');
navSectionsLen=0; //the number of the buttons on the nav menu
//...................

// 1) adding the sections to the HTML file dynamically
addNewNavSections(); 


/* 2)Scrolling to the section function is up there and it doesnt to be called here becuase
it excutes whenever i press the button*/


// 3) Scrolling and highlighting the current active section
setTimeout(function()
{
  //the setTimeout function is for calling the getSectionPos() 200ms late
  //there is some weird error with the values if we called it immediately
  sectionsPos= getSectionsPos();

  //variable that stores the last position at the document
  docBottomPos= Footer.offsetTop + Footer.offsetHeight-screenHeight+50;
  sectionsPos.push(docBottomPos);
  activeSection();

  /*Event that get called whenever we are scrolling
  it excutes the currentSection function which i explained before what it should be doing
  if you want to know what its doing again continue reading the next comment*/

  /* Here we are checking the current position of the viewport "scrollY" if it falls between 
  one section and the section next to it. for example if the position of the current viewport falls between the 
  position the second section and the third one then the second section is active */
  document.addEventListener('scroll', activeSection);
},200);


navSections=document.querySelectorAll('li'); //the buttons on the nav menu
navMenu= document.querySelector('.nav-menu'); //the navigation menu
//................


//Event that handles the page on resizing by re-setting most of the position related variabels again 
document.body.onresize=function() 
{
  console.log('resized'); //715 457
  screenHeight=window.innerHeight;
  sectionsPos= getSectionsPos();
  docBottomPos= Footer.offsetTop + Footer.offsetHeight-screenHeight+50;
  sectionsPos.push(docBottomPos);

  if (window.innerHeight<548 || window.innerWidth<955)
  {
    navMenu.style.display="none";
    isOpenable=false;
  }

  else
  {
    isOpenable=true;
    if (isListOpened)
    navMenu.style.display="flex";
    else
    navMenu.style.display="none";
  }
};

});