  var W;
  var img;
  var width;
  var height;
  var opened=false;
  function wOpen (s,w,h) {
    img=s;
    width=w;
    height=h;
    if (opened) W.close();
    W=window.open("preview.html","thunderbird_preview","toolbar=no,status=no,width="+(w+10)+",height="+(h+10));
    opened=false;
    setTimeout("setImage()",150);
  }
  
  function setImage() {
	if (W.document.getElementById('prevImage') != null) { 
		W.document.getElementById('prevImage').src="./img/screenshots/"+img+".png";
	} else {
		setTimeout("setImage()",50);
	}
	W.resizeTo(width,height);
	W.focus();
  	opened = true;
  }
  
  function wClose () {
    if (opened) W.close();
  }
