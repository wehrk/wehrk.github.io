// fold/unfold (collapsible) content
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}

// show/hide divider line
const folders = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < folders.length; i++) {
  	folders[i].addEventListener("click", function() {
    	var element = document.querySelector('.' + this.childNodes[1].childNodes[3].className);
    	var style = getComputedStyle(element);
   	 	var itsvisibility = style.opacity;
    	if ( itsvisibility == 1 ) {
    		this.childNodes[1].childNodes[3].style.opacity = 0;
			} else { 
    		this.childNodes[1].childNodes[3].style.opacity = 1;
		}
	});
}
