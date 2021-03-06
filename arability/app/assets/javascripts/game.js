var dimension = 10;
var table;
var cells;
var buttonArray = new Array();
var wordsArray = [];
var gameOver = false;
var level = 1;
var droppingBlocks;
var pullingBlocks;
var suspenseTimer;
var blockId = 0;
var waitTime = 1000;
var fallingTime = 200;
var wordExistsInArray = new Array();
var bigTower = '';
var lang;
var successfulWords = [];
var win = true;
var score = 0;
var gameButtonClear;
var gameButtonRestart;
var gameOverPopUp;
var wordsInDb = true;
var levelPopUpTitle;
var booleanSuspense = new Array(dimension);
var suspenseTimerArray = new Array(dimension);
var wasPrompted = false;
var gameOverFontSize;
var firstClick = true;
var tutorialFlag;
var currentClss;
var currentNewClss;
var currentBtn;
var currentRandNum;
var currentNewCounter;
var tutorialClick = true;
var secondTutorialClick = false;
var tutorialButtonId;
var newDrop = false;
var lockLangButtons = true;
var tutorialFlagWas = false;
var showSuspense = false;
var continuePlayingBtn;
var isGuest;
var wordsListPopoverContent;
var wordsListPopoverTitle;
var wordLabelPopoverContent;
var wordLabelPopoverTitle;
var tablePopoverContent;
var tablePopoverTitle;
var clickedButtonPopoverContent;
var clickedButtonPopoverTitle;
var clickedButtonPopoverButton;
var flashingTowerPopoverContent;
var flashingTowerPopoverTitle;
var flashingTowerPopoverButton;
var modalHeader;
var modalBody;
var modalYesButton;
var modalNoButton;
var letterPickerArray = [];
var intPickerArray = [];
var initialIntValues = [];
var listCountersArray = [];
var listCountersTimeouts = [];
var alreadyCounting = [];
var scorePopoverContent;
var scorePopoverTitle;

 // author:
 //   Ali El Zoheiry
 // description:
 //   on page load, if the tutorial flag is true, the language buttons are locked
 //   and the popovers are displayed
 // params:
 //   --
 // success:
 //   the popovers are displayed successfuly or the tutorial falg is false,
 //   and the popovers are not displayed
 // failure:
 //   --
$(function(){
	if(isGuest == true){
		$('.game-nav').css('display', 'none');
	}
	if(tutorialFlag == false){
		lockLangButtons = false;
		return;
	}
	$('.eng-btn').popover({
		container: $('#exposedEngBtnDiv')
	});
	setTimeout(function(){
		$('#exposedEngBtnDiv').expose({closeOnClick: false,
		closeOnEsc: false, color: 'black'});
	}, 500);
	setTimeout(function(){
		$('.eng-btn').popover('show');
		$('.popover').css('z-index', '9999999');
	}, 500);
});

function arBtnPopOver(){
	$('.ar-btn').popover({
		container: $('#exposedArBtnDiv')
	});
	setTimeout(function(){
		$('#exposedArBtnDiv').expose();
	}, 300);
	setTimeout(function(){
		$('.ar-btn').popover('show');
		$('.popover').css('z-index', '9999999');
	}, 300);
}

function bothBtnPopOver(){
	$('.both-btn').popover({
		container: $('#exposedBothBtnDiv')
	});
	setTimeout(function(){
		$('#exposedBothBtnDiv').expose();
	}, 300);
	setTimeout(function(){
		$('.both-btn').popover('show');
		$('.popover').css('z-index', '9999999');
	}, 300);
}

 // author:
 //   Ali El Zoheiry
 // description:
 //   takes the given id and destroys its corresponding popover
 // params:
 //   id
 // success:
 //   the popover is destroyed successfuly
 // failure:
 //   the id is invalid  
function destroy(id){
	$('#btn-clear').css('z-index', '0');
	id = id.replace('-po', '');
	$('#' + id).popover('destroy');
	$.mask.close();
	if(id == "eng-btn"){
		arBtnPopOver();
	}
	else if(id == "ar-btn"){
		bothBtnPopOver();
	}
	else if (id == "both-btn"){
		lockLangButtons = false;
	}
}

 // author:
 //   Ali El Zoheiry
 // description:
 //   displays the popover of the wordsList
 // params:
 //   --
 // success:
 //   the popover is displayed successfuly
 // failure:
 //   --
function wordsListToolTip(){
	$('#wordsList').popover();
	setTimeout(function(){
		$('#list-div').expose();
	}, 100);
	setTimeout(function(){
		$('#wordsList').popover('show');
		$('.popover').css('z-index', '9999999');
	}, 200);
	
}

 // author:
 //   Ali El Zoheiry
 // description:
 //   displays the popover of the table
 // params:
 //   --
 // success:
 //   the popover is displayed successfuly
 // failure:
 //   --
function tableToolTip(){
	setPopoverAttributes();
	$('#button7-5').popover({
		html: true,
		trigger: 'manual',
		content: "<p>" + tablePopoverContent + "</p>" ,
		title: "<h4>" + tablePopoverTitle + "</h4>",
		placement: 'top'
	});
	setTimeout(function(){
		$('#main-table').expose();
	}, 300);
	setTimeout(function(){
		$('#button7-5').popover('show');
		$('.popover').css('z-index', '9999999');
	}, 320);
	
}


 // author:
 //   Ali El Zoheiry
 // description:
 //   displays the popover of the wordLabel
 // params:
 //   --
 // success:
 //   the popover is displayed successfuly
 // failure:
 //   --
function wordLablelToolTip(){
	$('#wordLabel').popover();
	setTimeout(function(){
		$('.label-div').expose();
	}, 300);
	setTimeout(function(){
		$('#wordLabel').popover('show');
		$('.popover').css('z-index', '9999999');
	}, 400);
}

function scorePopover(){
	var scoreButton;
	if(JsLocale == "en"){
		scoreButton = "Next";
	}
	else{
		scoreButton = "التالي";
	}
	destroy('wordLabel');
	$('#game-score').popover({
		html: true,
		trigger: 'manual',
		content: "<p>" + scorePopoverContent + "<p><button class='tutBtn btn btn-primary' id='game-score-po' onclick='callNextToolTip2(this.id)'>" + scoreButton + "</button>",
		title: '<h4>' + scorePopoverTitle + '</h4>',
		placement: 'top'
	});
	setTimeout(function(){
		$('#game-score').expose();
	}, 300);
	setTimeout(function(){
		$('#game-score').popover('show')
		$('.popover').css('z-index', '9999999');
		$('#wordsList').css('z-index', '99999999');
		$('#wordsList').css('position', 'relative');
		if(JsLocale == 'ar'){
			$('.popover').css('top', '250px');
			$('.popover').css('left', '760px');
			$('.popover').css('width', '422px');
		}
	}, 400);
}

 // author:
 //   Ali El Zoheiry
 // description:
 //   destroys the popover with the corresponding id(previous popover)
 //   and calls the next popover to be displayed
 // params:
 //   id: is the id of the previous popover
 // success:
 //   the popover is destroyed and the 2nd one is displayed(label popover)
 // failure:
 //   invalid id, nothing will get destroyed
function callNextToolTip(id){
	destroy(id);
	wordLablelToolTip();
}

 // author:
 //   Ali El Zoheiry
 // description:
 //   destroys the popover with the corresponding id(previous popover)
 //   and calls the next popover to be displayed
 // params:
 //   id: is the id of the previous popover
 // success:
 //   the popover is destroyed and the 2nd one is displayed(table Popover)
 // failure:
 //   invalid id, nothing will get destroyed
function callNextToolTip2(id){
	$('#wordsList').css('z-index', '0');
	destroy(id);
	tableToolTip();
}


 // author:
 //   Ali El Zoheiry
 // description:
 //   called when the last popover button is clicked, destroys the 
 //   popover and ends the tutorial, thus starting the game
 // params:
 //   id: of the last Popover
 // success:
 //   the popover is destroyed and the game starts
 // failure:
 //   invalid id
function destroyAndStart(id){
	destroy(id);
	endTutorial();
}

// author:
//   Ali El Zoheiry.
// description:
//   newGame initialized the board(table) where the blocks will appear and initializes
//   the wordList that the keywords appear in, and also adds a popUp of the current level
//   and allows it to fadein and out then calls the startGame function to start. 
// params:
//   --
// success:
//   there are words in the database and the game zone is loaded successfuly.
// failure:
//   there are no words in the database and the gamer is prompted that he has no words.

function newGame(){
	getNewWords(1);
	if(wordsInDb == true){
	continuePlaying();
}
	else{
		wasPrompted = true;
		setButtons();
		$('.zone').empty();
		$('.zone').append('<h2 id ="empty-db-msg">' + generateEmptyDbMsg() +
			'<br><button class="btn btn-success" id="contPlayingBtn" onclick="continuePlaying()">' +
			continuePlayingBtn +'</button>');
	}
}
// author:
//   Ali El Zoheiry.
// description:
//   parses a few Html elements into jquery objects to be used again later in jquery syntax
//   and then calls the setLevelAttributes function. 
// params:
//   --
// success:
//   setLevelAttrivutes is called successfuly and control is handed.
// failure:
//   --

function startGame(){
	levelTitle = $('#level');
	table = $('#main-table');
	list = $('#wordsList');
	cells = table.find('td');
	buttons = table.find('button');
	setLevelAttributes(level);
}
// author:
//   Ali El Zoheiry.
// description:
//   initializes the table rows and columns with fixed width, with each td having a button inside
//   having a letter inside the button which is generated from the generateLetter function. 
// params:
//   --
// success:
//   table is created successfuly with buttons and letters inside the button.
// failure:
//   --(because no words in the database is handled in the newGame function).
function initializeGame(){
	var trHtml = [];
	var letter;
	for(var y = 0; y < dimension; y++){
		trHtml.push('<tr class="row');
		trHtml.push(y);
		trHtml.push('">');
			for(var x = 0; x < dimension; x++){
				if(y > dimension - 4){
					trHtml.push('<td style="min-width:50; max-width:50;" id="col');
					trHtml.push(y);
					trHtml.push('-');
					trHtml.push(x);
					trHtml.push('"><button onclick="callMethods(this.id)" class="btn btn-inverse" id="button');
					trHtml.push(y);
					trHtml.push('-');
					trHtml.push(x);
					trHtml.push('">');
					while(true){
						letter = generateLetter();
						if (letter != -1){
							break;
						}
					}
					trHtml.push(letter);
					trHtml.push('</button></td>');
				}
				else{
					trHtml.push('<td style="min-width:50; max-width:50;" id="col');
					trHtml.push(y);
					trHtml.push('-');
					trHtml.push(x);
					trHtml.push('"></td>');
				}
			}
		
			trHtml.push('</tr>');
	}
	trHtml = trHtml.join('');
	table.append($(trHtml));
}

// author:
//   Ali El Zoheiry.
// description:
//   puts the words in the wordsArray retrieved from the database in the list of words created above 
// params:
//   --
// success:
//   the words are added successfuly in the lists.
// failure:
//   --
function initializeList(){
	var lsHtml = [];
	for(var i = 0; i < wordsArray.length; i++){
		if(lang == 1){
			lsHtml.push("<li style='font-size: 22px;' id='ls");
		}
		else{
			lsHtml.push("<li id='ls");
		}
		lsHtml.push(i);
		lsHtml.push("'>");
		lsHtml.push(wordsArray[i]);
		lsHtml.push("</li>");
	}
	lsHtml = lsHtml.join('');
	list.append($(lsHtml));
	if(tutorialFlag == true){
		wordsListToolTip();
	}
	if(lang == 0){
		list.css('float', 'left');
		list.css('direction', 'ltr');
		list.css('margin-left', '10px');
		list.css('text-align', 'left');
	}
	else if(lang == 1){
		list.css('direction', 'rtl');
		list.css('text-align', 'right');
		list.css('float', 'right');
		list.css('margin-right', '20px');
	}
	 for(var x = 0; x < wordsArray.length; x++){
        var listId = 'ls' + x;
        if(lang == 0){
        	var timerfloat = 'right';
        	var margin = 'margin-left: 7px;'
        }
        else if(lang == 1){
        	var timerfloat = 'left';
        	var margin = 'margin-right: 10px;'
        }
        if(lang == 2){
       		$('#' + listId).append("&nbsp;&nbsp&nbsp<div style='float: " + timerfloat + "; color: white; display: inline-block; position: relative;" + margin + "' id='ls" + x + "Counter'>1</div>");

        }
        $('#' + listId).append("<div style='float: " + timerfloat + "; color: white; display: inline-block; position: relative;" + margin + "' id='ls" + x + "Counter'>1</div>");
    }
}

// author:
//   Ali El Zoheiry.
// description:
//   generates a letter and creates a new button and places it in the top row in a random column
//   and then calls the dropAblockCont method. 
// params:
//   --
// success:
//   the block and the letter are generated successfuly and placed in the correct place.
// failure:
//   the game is over.
function dropAblock(){
	if(tutorialFlag == true){
		newDrop = true;
		return;
	}
	if( gameOver == true ){
		return;
	}
	while(true){
		letter = generateLetter();	
		if(letter != -1){
			break;
		}
	}
	
	var randNum = Math.floor(Math.random()*dimension);
	var clss = 'col0-' + randNum;
	var newButton = "<button id='btn" + blockId + "' onclick= 'callMethods(this.id)' class= 'btn btn-inverse'>" + letter + "</button>";

	var btn = document.getElementById(clss).innerHTML = newButton;
	dropAblockCont(clss, btn, randNum, 0);
}


 // author:
 //   Ali El Zoheiry
 // description:
 //   pauses the game, by stopping any blocks from falling
 //   or any button from being clicked
 // params:
 //   --
 // success:
 //   the game is paused successfuly
 // failure:
 //   --
function pause(){
	for(var x = 0; x < wordsArray.length; x++){
		clearTimeout(listCountersTimeouts[x]);
	}
	tutorialFlag = true;
}

 // author:
 //   Ali El Zoheiry
 // description:
 //   unpauses the game and decides whether to drop a new block or
 //   continue pulling an old block based on the state of the game
 // params:
 //   --
 // success:
 //   the tutorial is stopped successfuly and the game starts
 // failure:
 //   tutorial wasent started
function endTutorial(){
	tutorialFlag = false;
	for(var x = 0; x < wordsArray.length; x++){
		var lsId = 'ls' + x;
		CheckStatus(lsId);
	}
	showSuspense = true;
	tutorialFlagWas = true;
	if(newDrop == true){
		newDrop = false;
		dropAblock();
	}
	else{
		if(document.getElementById(currentNewClss).innerHTML == ''){
			document.getElementById(currentClss).innerHTML = '';
			document.getElementById(currentNewClss).innerHTML = currentBtn;
			dropAblockCont(currentNewClss, currentBtn, currentRandNum, currentNewCounter);
		}
		else{
			blockLanded();
		}
	}
}

 // author:
 //   Ali El Zoheiry
 // description:
 //   does the same as endTutorial() without setting the tutorialflagwas to true
 // params:
 //   --
 // success:
 //   game is unpaused and started successfuly
 // failure:
 //   game was not paused
function unPause(){
	tutorialFlag = false;
	for(var x = 0; x < wordsArray.length; x++){
		var lsId = 'ls' + x;
		CheckStatus(lsId);
	}
	if(newDrop == true){
		newDrop = false;
		dropAblock();
	}
	else{
		if(document.getElementById(currentNewClss).innerHTML == ''){
			document.getElementById(currentClss).innerHTML = '';
			document.getElementById(currentNewClss).innerHTML = currentBtn;
			dropAblockCont(currentNewClss, currentBtn, currentRandNum, currentNewCounter);
		}
		else{
			blockLanded();
		}
	}
}


 // author:
 //   Ali El Zoheiry
 // description:
 //   destroys the popover with the corresponding id(previous popover)
 //   and unpauses the game
 // params:
 //   id: is the id of the previous popover
 // success:
 //   the popover is destroyed and the game starts
 // failure:
 //   invalid id
function destroyAndUnpause(id){
	destroy(id);
	unPause();
}

// author:
//   Ali El Zoheiry.
// description:
//   takes the block that was randomly placed and starts pulling it one row down each "fallingTime" milli seconds
//   which is decreased every level, until there is another block below it
//   then a new block is placed and is to be pulled. 
// params:
//   clss: it is the id of the id of the cell that contains the button to be pulled.
//   btn: it is the Html of the actual button to be pulled down.
//   randNum: is the random column number that the block was placed
//   counter: is a counter that keeps track of the number of blocks dropped
// success:
//   the block is pulled down until it reaches another button bewlow it and dropAblock is called again to read a new block.
// failure:
//   the game is over no blocks will fall.
function dropAblockCont(clss, btn, randNum, counter){
	if(gameOver==true){
		return;
	}
	var stop;
	var newCounter = counter + 1;
	var newClss = 'col' + newCounter  + '-' + randNum;

	pullingBlocks = setTimeout(function(){
		if(newCounter == dimension){
			if(tutorialFlag == false){
				blockLanded();
			}
			else{
				return;
			}
		}
		else{
			if(tutorialFlag == false){
				if(document.getElementById(newClss).innerHTML == ''){
					document.getElementById(clss).innerHTML = '';
					document.getElementById(newClss).innerHTML = btn;
					dropAblockCont(newClss, btn, randNum, newCounter);
				}
				else{
					if(tutorialFlag == false){
						blockLanded(); 
					}
					else{
						return;
					}
				}
			}
			else{
				currentClss = clss;
				currentNewClss = newClss;
				currentBtn = btn;
				currentRandNum = randNum;
				currentNewCounter = newCounter;
			}
		}
	}, fallingTime);// <------set the drop fall time here
}


 // author:
 //   Ali El Zoheiry
 // description:
 //   checks if the game is over or not, if notcalls dropAblock to create
 //   a new block and start dropping it
 // params:
 //   --
 // success:
 //   either the game stops, or a new block is dropped
 // failure:
 //   --
function blockLanded(){
	buttons = table.find('button');
	var tower = highestTower();
	calculatePossible();
	suspense();
	blockId++;
	if(loseGame(tower)){
		return;
	}
	droppingBlocks = setTimeout(function() {
		dropAblock();
	} , waitTime);
}

// author:
//   Ali El Zoheiry.
// description:
//   places all the buttons currently in a table and matches their letters with the words available in the list
//   if a word could be formed from the current letters then it is given the color orange, else if it was
//   successfuly formed it is striked out and given the color red, else if it cannot be formed it will have the color grey. 
// params:
//   --
// success:
//   after each block lands this method is called and the possibilites are checked and the css is added.
// failure:
//   --
function calculatePossible(){
	var allLetters = '';
	var l = table.find('button');
	for(var i = 0; i < l.length; i++){
		allLetters += l[i].innerHTML;
	}
		var canBeFormed;
		var yesCounter;
		var tmpAllLetters;
		for(var k = 0; k < wordsArray.length; k ++){
			yesCounter = 0;
			tmpAllLetters = allLetters;
			if(canBeFormed == true){
				var postfixNum = k - 1;
				lsId = "ls" + postfixNum;
				$('#' + lsId).addClass('text-warning');
				$('#' + lsId).css( "color", "orange" );
				CheckStatus(lsId);
			}
			else{
				var postfixNum = k - 1;
				lsId = "ls" + postfixNum;
				$('#' + lsId).removeClass('text-warning');
				$('#' + lsId).css("color", "#333333");
				stopCounter(lsId);
			}
			for(var l = 0; l < wordsArray[k].length; l++){
				canBeFormed = false;
				for(var m = 0; m < tmpAllLetters.length; m++){
					if(wordsArray[k].charAt(l) == tmpAllLetters.charAt(m)){
						yesCounter++;
						var let = wordsArray[k].charAt(l);
						var reg = new RegExp(let);
						tmpAllLetters = tmpAllLetters.replace(reg, "");
						break;
					}
				}
			}
				if(yesCounter == wordsArray[k].length){
					canBeFormed = true;
				}
				else{
					canBeFormed = false;
				}
		}
		if(canBeFormed == true){
			var postfixNum = k - 1;
			lsId = "ls" + postfixNum;
			$('#' + lsId).addClass('text-warning');
			$('#' + lsId).css("color", "orange");
			CheckStatus(lsId);
		}
		else{
			var postfixNum = k - 1;
			lsId = "ls" + postfixNum;
			$('#' + lsId).removeClass('text-warning');
			$('#' + lsId).css("color", "#333333");
			stopCounter(lsId);
		}
}


// author:
//   Ali El Zoheiry.
// description:
//   when a button is clicked it is added to an array of buttons and given a different color than the rest
//   and when a button is clicked twice, if it was the last button to be clicked it will be removed. 
// params:
//   id: is the id of the button being clicked
// success:
//   the letters are clicked and are added in an array of buttons.
// failure:
//   the gamer clicked the same button twice and that button was not at the end of the array, then nothing will happen
//   or the game is over.
function formWord(id){
	if(buttonArray.length > 0){
		for(var i = 0; i < buttonArray.length; i++){
			if(buttonArray[i].get(0) == $('#' + id).get(0)){
				if(i != buttonArray.length - 1){
					return;
				}
			}
		}
	}
	if(buttonArray.length > 0){
		if(buttonArray[buttonArray.length - 1].get(0) == $('#' + id).get(0)){	
			$('#' + id).removeClass('btn-warning');
			$('#' + id).addClass('btn-inverse');
			buttonArray.pop();
			if(buttonArray.length > 0){
				buttonArray[buttonArray.length - 1].removeClass('btn-success');
				buttonArray[buttonArray.length - 1].addClass('btn-warning');
			  	}
			return;
		}
	}
			if(buttonArray.length == 0){	
				buttonArray.push($('#' + id));
				$('#' + id).removeClass('btn-inverse');
				$('#' + id).addClass('btn-warning');
			}
			else{
				if(document.getElementById("wordLabel").innerHTML.length > 16){
					return;
				}	
					buttonArray.push($('#' + id));
					$('#' + id).removeClass('btn-inverse');
					$('#' + id).addClass('btn-warning');
					buttonArray[buttonArray.length - 2].removeClass('btn-warning');
					buttonArray[buttonArray.length - 2].addClass('btn-success');
			} 
		
}

// author:
//   Ali El Zoheiry.
// description:
//   loops over the array of buttons which was formed in the previous function and adds the current letters in
//   a label for the gamer to see. 
// params:
//   --
// success:
//   the array has buttons and they are added to the label successfuly.
// failure:
//   the array is empty or the game is over.
function generateWord(){
	var newWord = '';
	for(var i = 0; i < buttonArray.length; i++){
			newWord += buttonArray[i].html();
		}	
	 
		var oldLetters = document.getElementById("wordLabel").innerHTML;
		document.getElementById("wordLabel").innerHTML = newWord;
}


// author:
//   Ali El Zoheiry.
// description:
//   is a function to be called onClick which will add call these three functions (formWord, generateWord, removeAblock). 
// params:
//   id of the button being clicked
// success:
//   the button is clicked and the methods are called successfuly.
// failure:
//   the game is over, on click nothing will happen.
function callMethods(id){
	if(id == 'btn' + blockId){
		return;
	}
	if(tutorialFlag == true && tutorialClick == false && secondTutorialClick == false){
		return;
	}
	else if(secondTutorialClick == true && tutorialFlag == true){
		if(id != tutorialButtonId){
			return;
		}
		else{
			formWord(id);
			generateWord();
			secondTutorialClick = false;
			return;
		}
	}
	if(gameOver == true){
		return;
	}
	formWord(id);
	generateWord();
	removeAblock();
	if(firstClick == true){
		tutorialClick = false;
		firstClick = false;
		secondTutorialClick = true;
		destroy('button7-5-po');
		$('#' + id).popover({
			html: true,
			trigger: 'manual',
			content: "<p>" + clickedButtonPopoverContent + "<p><br> <button class='tutBtn btn btn-primary' id='" + id + "-po' onclick='destroyAndStart(this.id)'>" + clickedButtonPopoverButton + "</button>",
			title: '<h4>' + clickedButtonPopoverTitle + '</h4>',
			placement: 'top'
		});
		$('#btn-clear').css('z-index', '99999999');
		$('#btn-clear').css('position', 'relative');
		var newId = id.replace('button','');
		var tdId = 'col' + newId;
		if(tutorialFlag == true){
			setTimeout(function(){
				$('#' + tdId).expose();
			}, 200);
			setTimeout(function(){
				$('#' + id).popover('show');
				$('.popover').css('z-index', '9999999');
				tutorialButtonId = id;
			}, 300);
		}
	}
}

// author:
//   Ali El Zoheiry.
// description:
//   is given an id of a cell and returns the row number of the cell obove it. 
// params:
//   id of the cell which it's upperRow is required
// success:
//   the id is valid and has an upper row, it will be returned.
// failure:
//   the id is not valid or has no upper row, then nothing will happen.
function calculateUpperRow(id){
	var upperRow = '';
	for(var i = 3; i < id.length; i++){
		if(id.charAt(i) == '-'){
			break;
		}
		else{
			upperRow += id.charAt(i);
		}
	}
	var upperRowInt = parseInt(upperRow) - 1;
	return upperRowInt;
}

// author:
//   Ali El Zoheiry.
// description:
//   is given an id of a cell and returns its number column number. 
// params:
//   id of the cell which it's column number is required
// success:
//   the id is valid and has a coloumn number, it will be returned.
// failure:
//   the id is not valid.

function calculateCol(id){
	var upperCol = '';
	for(var i = 5; i < id.length; i++){
		if(id.charAt(i - 2) == '-' || id.charAt(i - 1) == '-'){
			upperCol += id.charAt(i);
		}
		else{

		}
	}
	var upperColInt = parseInt(upperCol);
	return upperColInt;
}


// author:
//   Ali El Zoheiry.
// description:
//   is called upon every button click and checks if the words in the label, are equal to
//   one of the words in the array, if so another function will be called. 
// params:
//   --
// success:
//   the words in the label match one of the words in the list.
// failure:
//   there are no words in the list or the label is empty, or the game is over.

function removeAblock(){
	var x;
	var word = document.getElementById("wordLabel").innerHTML;
	for(x = 0; x < wordsArray.length; x++){
		if(wordsArray[x] == word && wordExistsInArray[x] == true){
			removeFromLetterPicker(word);
			var lsId = 'ls' + x
			stopCounter(lsId);
			alreadyCounting[x] = true;
			for(var i = 0; i < buttonArray.length; i++){
				var toBeRemovedId = buttonArray[i].closest('td').attr('id');
				$('#' + toBeRemovedId).fadeTo('slow',0.5);
			}
			setTimeout('fadeSomething(' + x + ')' , 300);
		}
	}
}

// author:
//   Ali El Zoheiry.
// description:
//   is called after removeAblock and is passed the index of the word in the word that was a match
//   and start looping over the buttons array and removes the buttons that successfuly formed the word
//   and also strikes out the word in the words list and changes its color to red
//   and the word that was formed is pushed in an array of successfuly formed words and a value of false
//   is added to an array of falgs to specify which word was formed to prevent it from being formed again
//   then checks if the words list is empty meaning the gamer has won, then the gamer is redirected to a different view. 
// params:
//   x: the index of the word in the wordsArray which was a match to the word being formed
// success:
//   the game is not over yet, and the buttons are successfuly removed from the board.
// failure:
//   the game is over, the gamer will lose.
function fadeSomething(x){
	for(var i = 0; i < buttonArray.length; i++){
		var toBeRemovedId = buttonArray[i].closest('td').attr('id');
		document.getElementById(toBeRemovedId).innerHTML = '';
		$('#' + toBeRemovedId).fadeTo('fast',1);
	}
	var lsId = "ls" + x;
	var originalLi = document.getElementById(lsId).innerHTML;
	document.getElementById(lsId).innerHTML = "<strike style='color: red;'>" + originalLi + "</strike>";
	calculateScore(lsId);
	if(wordsInDb == true){
		successfulWords.push(wordsArray[x]);
	}
	wordExistsInArray[x] = false;
	calculatePossible();
	win = true;
	for(var finished = 0; finished < wordExistsInArray.length; finished++){
		if(wordExistsInArray[finished] == true){
			win = false;
		}
	}
	if(win == true){
		if(tutorialFlagWas == true && level == 1){
			tutorialflagwas = false;
			buttonArray = [];
			removeAblock();
			pause();
			setModalTranslations();
			$('.zone').append('<div class="modal hide fade "><div class="modal-header"><h3>' + modalHeader + '</h3></div><div class="modal-body"><p>' + modalBody + '</p></div><div class="modal-footer"><button class="btn" style="width: 100px;" onclick="modalButtonClicked(true)">' + modalYesButton + '</button><button class="btn btn-success" style="width: 100px;" onclick="modalButtonClicked(false)">' + modalNoButton + '</button></div></div>');
			$('.modal').css('z-index', '999999999999999')
			$('.modal').on('hidden', function () {
				winTheGame();
			})
			$('.modal').modal('show');
		}
		else{
			winTheGame();
		}
	}		
	else{
		buttonArray = [];
		generateWord();
		removeAblockCont();
	}
}

// author:
//   Ali El Zoheiry.
// description:
//   loops over the whole table and finds the gap (1 upper button and 1 lower button with spaces between them)
//   and calculates the size of the gap and calls the startPulling function to pull the blocks down the gap. 
// params:
//   --
// success:
//   gaps were found and the gap size is calculated successfuly.
// failure:
//   there were no gaps(meaning the blocks removed were all from the top row).
function removeAblockCont(){
	var hasUpper;
	var count;
	var testFlag;
	for(var rows = dimension - 1; rows > 0; rows--){
		for(var cols = 0; cols < dimension; cols++){
			var createdId = "col" + rows + "-" + cols;
			if(document.getElementById(createdId).innerHTML == ""){
				count = 0;
				hasUpper = false;
				for(var r = rows - 1; r > 0; r--){
					var upperRowId = "col" + r + "-" + cols;
					var upperCell = document.getElementById(upperRowId).innerHTML;
					var beingDropedId = "btn" + blockId;
					var btnBeingDropped = $(document.getElementById(beingDropedId)).closest('td').html();
					if(upperCell == ''){
						count++;
					}
					else{
						if(upperCell == btnBeingDropped){
							break;
						}
						else{
							hasUpper = true;
							break;
						}
					}
				}
				if(hasUpper == true){
					startPulling(rows, cols, count);
				}
			}
			
		}
	}
	stopSuspense();
}


// author:
//   Ali El Zoheiry.
// description:
//   takes the place of the cell where the gap occured and pulls the block above it by the size of the gap. 
// params:
//   r: the row number of the cell were the gap was encountered.
//   c: the column number of the cell were the gap occured.
//   count: the size of the gap
// success:
//   the blocks were pulled successfuly and all gaps were filled.
// failure:
//   the game ended before the blocks were pulled.
function startPulling(r, c, count){
	// alert('testing');
	var place = "col"+ r + "-" + c;
	var newR = r - count - 1;
	var toBePulled = "col" + newR + "-" + c;
	var btn = document.getElementById(toBePulled).innerHTML;
	document.getElementById(toBePulled).innerHTML = '';
	document.getElementById(place).innerHTML = btn;

}

// author:
//   Ali El Zoheiry.
// description:
//   set the values of the letterPickerArray which will contain the letters of all the words in the list
//   and sets their default drop value to 1 
// params:
//   --
// success:
//   the 2 arrays are set successfully and are not empty
// failure:
//   the game has not started yet or there are no words in the game.
function setLetterPicker(){
	var totalLetters = 0;
	letterPickerArray = [];
	intPickerArray = [];
	for(var i = 0; i < wordsArray.length; i++){
		for(var j = 0; j < wordsArray[i].length; j++){
			letterPickerArray[totalLetters] = wordsArray[i].charAt(j);
			intPickerArray[totalLetters] = 1;
			totalLetters++;
		}
	}
	for(var x = 0; x < intPickerArray.length; x++){
		initialIntValues[x] = intPickerArray[x];
	}
}

// author:
//   Ali El Zoheiry.
// description:
//   once a word is formed its letters are marked as -1 in the intPicker array
//   so they wont be picked again
// params:
//   word: the word that the gamer has just formed
// success:
//   all the letters in the above word are marked as -1 intPicker array
// failure:
//   the word is not valid or does not exists in the database.
function removeFromLetterPicker(word){
	for(var i = 0; i < word.length; i++){
		var howManyLeft = countCurrentWords();
		var toBeRemovedIndex = jQuery.inArray(word.charAt(i), letterPickerArray);
		if(toBeRemovedIndex == -1 || howManyLeft < 2){
			return;
		}
		letterPickerArray.splice(toBeRemovedIndex, 1);
		intPickerArray.splice(toBeRemovedIndex, 1);
	}
}

// author:
//   Ali El Zoheiry.
// description:
//   takes all of the words in the word list and places their letters in a string, then generates a random number
//   which will be the index of the letter to be generated from the string of all words. 
// params:
//   --
// success:
//   the word list contains words and a random letter is generated.
// failure:
//   no words in the words list.
function generateLetter(){
	var letter;
	length = letterPickerArray.length;
	var randIndex = Math.floor(Math.random() * length);
	if(intPickerArray[randIndex] == 1){
		intPickerArray[randIndex] = 0;
		letter = letterPickerArray[randIndex];
		return letter;
	}
	else{
		if(intPickerArray[randIndex] == 0){
			var nextEntry = nextValidEntry();
			if(nextEntry == false){
				intPickerArray[randIndex] = 1;
				return - 1;
			}
			else{
				intPickerArray[nextEntry] = 0;
				letter = letterPickerArray[nextEntry];
				return letter;
			}
		}
	}
}

// author:
//   Ali El Zoheiry.
// description:
//   the function is given a letter and checks whether that same letter is repeated again in the letters array
// params:
//   currentEntry: the current letter being checked
// success:
//   Either there is a next entry of the same level, then that entry will be returned
//   or there that letter is not repeated again, therfore false will be returneds
// failure:
//   invalid argument passed.
function nextValidEntry(currentEntry){
	var nextEntry;
	nextEntry = jQuery.inArray(letterPickerArray[currentEntry],letterPickerArray, currentEntry + 1);
	if(nextEntry == -1){
		return false;
	}
	else if(intPickerArray[nextEntry] == 1){
		return nextEntry;
	}
	else{
		checkNextValidEntry(nextEntry);
	}
}

// author:
//   Ali El Zoheiry.
// description:
//   counts the number of words remaining that the gamer has not formed yet.
// params:
//   --
// success:
//   successfully returns the number of words left.
// failure:
//   The game has not started yet, therfore there will be no words.
function countCurrentWords(){
	var count = 0;
	for(var i = 0; i < wordExistsInArray.length; i++){
		if(wordExistsInArray[i] == true){
			count++;
		}
	}
	return count;
}


// author:
//   Ali El Zoheiry.
// description:
//   is called on button click of the clear word button, which deleted all the letters from the array of buttons
//   and from the label aswell, and return their color back to the default. 
// params:
//   --
// success:
//   there was a word in the midst of formation, it will be successfuly cleared.
// failure:
//   no buttons were clicked.
function clearWord(){
	document.getElementById('wordLabel').innerHTML = '';
	for(var i = 0; i < buttonArray.length; i++){
		buttonArray[i].removeClass('btn-warning');
		buttonArray[i].removeClass('btn-success');
		buttonArray[i].addClass('btn-inverse');
	}
	buttonArray = [];
	generateWord();
}


// author:
//   Ali El Zoheiry.
// description:
//   is called upon the completion of a level, it increments the level number, and clears all the time outs
//   and resets all the global variables. 
// params:
//   --
// success:
//   there exists a next level, it will be started.
// failure:
//   there is no next level, then the user will be promted that he has finished all the levels.
function nextLevel(){
	getNewWords(1);
	if(wordsInDb == true){
		toNextLevel();
	}
	else{
		if(wasPrompted == false){
			wasPrompted = true;
			setButtons();
			$('.zone').empty();
			$('.zone').append('<h2 id ="empty-db-msg">' + generateEmptyDbMsg() +
			'<br><button class="btn btn-success" id="contPlayingBtn" onclick="toNextLevel()">' +
			continuePlayingBtn +'</button>');
		}
		else{
			toNextLevel();
		}
	}
	
}

// author:
//   Ali El Zoheiry.
// description:
//   loops over the board and calculates the number of the highest column formed so far. 
// params:
//   --
// success:
//   the board is not empty and the height of the column is calculated successfuly.
// failure:
//   the board is empty.
function highestTower(){
	var towerHeight;
	var heighestSoFar = 0;
	for(var cols = 0; cols < dimension; cols++){
		towerHeight = 0;
		for(var rows = dimension - 1; rows > -1; rows--){
			cellId = "col" + rows + "-" + cols;
			if(document.getElementById(cellId).innerHTML != ''){
				towerHeight++;
			}
			else{
				break;
			}
		}
		if(towerHeight > heighestSoFar){
			heighestSoFar = towerHeight;
		}
	}
	return heighestSoFar;
}

// author:
//   Ali El Zoheiry.
// description:
//   checks if any column has reached a height of 8 or greater, then passes control onto another function to add effects. 
// params:
//   --
// success:
//   a column has reached a height of 8 or greater it will start flashing.
// failure:
//   no column reached the height of 7 or greater or this tower is already flashing.
function suspense(){
	var enter = false;
	for(x = 0; x < dimension; x++){
		var id = 'col2-' + x;
		if(document.getElementById(id).innerHTML != '' && booleanSuspense[x] != true){
			enter = true;
			break;
		}
	}
	if(enter == true){
		if(showSuspense == true){
			showSuspense = false;
			tutorialFlag = true;
			setPopoverAttributes();
			$('#' + id).popover({
				html: true,
				trigger: 'manual',
				content: "<p>" + flashingTowerPopoverContent + "</p><button onclick='destroyAndUnpause(this.id)' class='tutBtn btn btn-primary' id='" + id + "-po'>" + flashingTowerPopoverButton + "</button>",
				title: '<h4>' + flashingTowerPopoverTitle + '</h4>',
				placement: 'left'
			});
			setTimeout(function(){ 
				$('#' + id).popover('show');
			}, 100);
			setTimeout(function(){
				$('.row2').expose({closeOnClick: false,
				closeOnEsc: false, color: 'black', opacity: 0.8});
				$('.popover').css('z-index', '9999999');
				var suffix = "-" + x;
				$("td[id*=" + suffix + "]").css('position', 'relative');
				$("td[id*=" + suffix + "]").css('z-index', '99999999');
			}, 100);
		}
		suspenseCont(x);
		booleanSuspense[x] = true;
	}
}

// author:
//   Ali El Zoheiry.
// description:
//   checks if a column was flashing and then its height dropped to less than 8, it clears its time out and make it stop flashing. 
// params:
//   --
// success:
//   a tower was flashing and then dropped in height it will stop flashing.
// failure:
//   no column was flashing or no column reached the required height.
function stopSuspense(){
	for(x = 0; x < booleanSuspense.length; x++){
		if(booleanSuspense[x] == true){
			var id = 'col2-' + x;
			if(document.getElementById(id).innerHTML == ''){
				clearTimeout(suspenseTimerArray[x]);
				booleanSuspense[x] = false;
			}
		}
	}
}


// author:
//   Ali El Zoheiry.
// description:
//   takes the column number of the column that reached the required height, 
//   and start making it fade in and out every 500 mili seconds. 
// params:
//   col: the column number of the column to be flashed
// success:
//   the height of this column is greater than 7, it will start flashing.
// failure:
//   --
function suspenseCont(col){
		suspenseTimerArray[col] = setTimeout(function(){
			var suffix = "-" + col;
			$("td[id*=" + suffix + "]").fadeTo('fast', 0.7).fadeTo('fast',1);
			suspenseCont(col);
		}, 500);
}


// author:
//   Ali El Zoheiry.
// description:
//   creates an ajax request with the number of words requested from the server, and the language of choice. 
// params:
//   num: number of words requested from the database
// success:
//   there are words in the database, they will be put in the javascript variable wordsArray.
// failure:
//   no words in the database.
function getNewWords(num){
	$.ajaxSetup({async: false});
	$.get("/games/getnewwords/?count=" + num +"&lang=" + lang);
}


// author:
//   Ali El Zoheiry.
// description:
//   sets different critera for each level, including speed of droping the blocks and number of words in the level. 
// params:
//   level: the current level the gamer is at.
// success:
//   the game is started and the level block speed and number of words are chosen correctly
//   depending on the levels
// failure:
//   --
function setLevelAttributes(level){
	if(level >= 8){
		waitTime = 500;
		fallingTime = 95;
	}
	else{
		waitTime = 1000 - ((level - 1) * 70);
		fallingTime = 200 - ((level - 1) * 15);
	}
	if(level >= 9){
		getNewWords(10);
	}
	else{
		getNewWords(level + 1);
	}
	for(var x = 0; x < wordsArray.length; x++){
		wordsArray[x] = wordsArray[x].toUpperCase();
	}
	for(var i = 0; i < wordsArray.length; i++){
		wordExistsInArray[i] = true;
		listCountersArray[i] = 1;
	}
	setLetterPicker();
	initializeGame();
	initializeList();
	calculatePossible();
	dropAblock();
}
// author:
//   Ali El Zoheiry.
// description:
//   sets the language of the words to be fetched from the database, based on which button the gamer clicked. 
// params:
//   l: is an integer value, 0 meaning the language is english, 1 meaning it is arabic, 2 meaning it is both.
// success:
//   the button is clicked and the language is set.
// failure:
//   --
function setLang(l){
	if(lockLangButtons == true){
		return;
	}
	disableNav();
	$('.zone').empty();
	$(".zone").slideUp(1000);
	$(".zone").slideDown(1000);
	lang = l;
	setTimeout(function(){
		
		newGame();
	}, 1100);
}

// author:
//   Ali El Zoheiry.
// description:
//   calculates the new score that the gamer gets based on the level and each formed word. 
// params:
//   --
// success:
//   the gamer formed a word and his score is added.
// failure:
//   --
function calculateScore(lsId){
	var index = parseInt(lsId.replace('ls', ''));
	var numLetters = wordsArray[index].length;
	var timer = parseInt(document.getElementById(lsId + 'Counter').innerHTML);
	score = Math.ceil(score + (((numLetters*100)/timer) * level));
	setScoreTitle();
}




function loseGame(t){
	if(t > dimension - 1){
		gameOver = true;
		win = false;
		buttonArray = [];
		generateWord();
		clearTimeout(suspenseTimer);
		clearTimeout(pullingBlocks);
		clearTimeout(droppingBlocks);
		$('tr').fadeOut('slow');
		setTimeout(function(){$('tr').fadeIn('slow');
		$('tr').empty();
		}, 500);
		generateGameOverPopUp();
		$('.zone').append('<div id ="gameover-popup"' +
		'style="font-size: ' + gameOverFontSize + '; color: white; position: absolute; margin-top: 120px;">' +
		'<p style="text-align: center;">' + generateGameOverPopUp() + '</p></div>');
		$('#gameover-popup').fadeTo(0,0);
		$('#gameover-popup').fadeTo(1500,1);
		$('#gameover-popup').fadeTo(1500,0);
		setWordsArray();
		setTimeout(function(){
			if(wordsInDb == false){
				getScoreOnly(score);
			}
			else{
				enableNav();
				have_to_sign_in();
			}
			return true;
		}, 3000);
	}

	else{
		return false;
	}
}

function continuePlaying(){
	$('.zone').empty();
	setButtons();
	setPopoverAttributes();
	setLevelPopUpTitle();
	$('.zone').append('<div><table class="table1" id="main-table"></table></div>' +
	'<div id="list-div" class="well"><ol data-html="true" data-trigger="manual" data-content="' + wordsListPopoverContent +  
	'" data-placement="left" data-title="' + wordsListPopoverTitle +  '" id="wordsList"></ol>' + 
	'<div class="label-div"><label data-trigger="manual" data-html="true" data-content="' + wordLabelPopoverContent +
	'" data-title="' + wordLabelPopoverTitle + '" data-placement="bottom" id="wordLabel" class="label1"></label></div></div>'+
	'<br><br><div><h3 id="game-score"></h3></div>' + 
	'<div class="buttons-div">' + gameButtonClear + gameButtonRestart +'</div>'+
	'<div id ="level-popup" style="font-size: 180px; color: white; position: absolute; margin-top: 120px; margin-right:30px;">' + levelPopUpTitle + ' ' + level  +'</div>');
	if(JsLocale == 'ar'){
		$('#game-score').css('text-align', 'right');
		$('#game-score').css('direction', 'ltr');
		$('#game-score').css('margin-right', '20px');
	}
	if(lang == 1){
		$('#wordLabel').css('font-size', '22px');
	}
	$('#level-popup').fadeTo(0,0);
	$('#level-popup').fadeTo(1500,1);
	$('#level-popup').fadeTo(1500,0);
	setTimeout(function(){
		$('#level-popup').remove();
		setScoreTitle();
		startGame();
	}, 3500);
}



// author:
//   Ali El Zoheiry
// description:
//   an abstraction of the nextLevel() method to be called from various stages
// params:
//   --
// success:
//   the gamer has finished the level and is redirected to the next level
// failure:
//   --
function toNextLevel(){
	disableNav();
	level++;
	$('.zone').empty();
	$('.zone').append('<div><table class="table1" id="main-table"></table></div>' +
	'<div id="list-div" class="well" ><ol id="wordsList"></ol>' + 
	'<div class="label-div"><label id="wordLabel" class="label1"></label></div></div>' +
	'<div class="buttons-div">' + gameButtonClear + gameButtonRestart +'</div>' +
	'<br><br><div><h3 id="game-score"></h3></div>' +
	'<div id ="level-popup" style="font-size: 180px; color: white; position: absolute; margin-top: 120px;">' + levelPopUpTitle + ' ' + level  +'</div>');
	$('#level-popup').fadeTo(0,0);
	$('#level-popup').fadeTo(1500,1);
	$('#level-popup').fadeTo(1500,0);
	setTimeout(function(){
		$('#level-popup').remove();
		$('#main-table').empty();
		$('#wordsList').empty();
		$('#level').empty();
		setScoreTitle();
		buttonArray = [];
		bigTower = '';
		gameOver = false;
		successfulWords = [];
		clearTimeout(pullingBlocks);
		clearTimeout(droppingBlocks);
		for(var x = 0; x < booleanSuspense.length; x++){
			if(booleanSuspense[x] == true){
				clearTimeout(suspenseTimerArray[x]);
				booleanSuspense[x] = false;
			}
		}
		startGame();
	}, 3500);
}

function winTheGame(){
	buttonArray = [];
	removeAblockCont();
	gameOver = true;
	$(".zone").slideUp(1000);
	setTimeout(function(){
		$(".zone").slideDown(1000);
	}, 1000);	
	setTimeout(function(){
		if(wordsInDb == false){
			getTrophies(level,score);
		}
		else{
			setWordsArray();
			enableNav();
			have_to_sign_in();
		}
		return;
	}, 1000);
}

function modalButtonClicked(answer){
	if(answer == true){
		tutorialFlag = false;
		$('.modal').modal('hide');
	}
	else{
		if(answer == false){
			tutorialFlag = false;
			disableTutorial();
			$('.modal').modal('hide');
		}
	}
}

function disableTutorial(){
	$.ajaxSetup({async: false});
	$.get("games/disableTutorial");
}


function CheckStatus(listId){
	var index = parseInt(listId.replace('ls', ''));
	if(alreadyCounting[index] == true || tutorialFlag == true){
		return;
	}
	else{
		alreadyCounting[index] = true;
		startCounter(listId);
	}
}

function startCounter(listId){
	var index = parseInt(listId.replace('ls', ''));
    listCountersTimeouts[index] = setTimeout(function(){
        $('#' + listId +'Counter').empty();
        var newVal = listCountersArray[index] + 1;
        $('#' + listId +'Counter').append(newVal);
        listCountersArray[index] = newVal;
        startCounter(listId);
    }, 1000);
}

function stopCounter(listId){
    var index = parseInt(listId.replace('ls', ''));
    alreadyCounting[index] = false;
    clearTimeout(listCountersTimeouts[index]);
}
