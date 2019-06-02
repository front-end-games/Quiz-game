/**********QUIZ CONTROLLER*********/

//1
var quizController = (function () {

    //4
    /*********Question Constructor*********/
    function Question(id, questionText, options, correctAnswer) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }
    var questionLocalStorage = {
        setQuestionCollection: function (newCollection) {
            localStorage.setItem('questionCollection', JSON.stringify(newCollection));  // zamieniamy newCollection --> JSON
        },
        getQuestionCollection: function () {
            return JSON.parse(localStorage.getItem("questionCollection"));
        },
        removeQuestionCollection: function () {
            localStorage.removeItem("questionCollection")
        }
    };

    //ocalStorage, gdy nie jest stworzony to zwraca null, więc:
    if (questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
    }

    var quizProgress = {
        questionIndex: 0
    };

    //**********Person Constructor *********/
    function Person(id, firstName, lastName, score) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.score = score;
    }

    var currPersonData = {
        fullname: [],
        score: 0
    };

    var adminFullName = ['Admin', "Admin"];

    var personLocalStorage = {
        setPersonData: function (newPersonData) {
            localStorage.setItem('personData', JSON.stringify(newPersonData));
        },
        getPersonData: function () {
            return JSON.parse(localStorage.getItem('personData'));
        },

        removePersonData: function () {
            localStorage.removeItem('personData');
        }
    };

    if (personLocalStorage.getPersonData() === null) {
        personLocalStorage.setPersonData([]);
    }

    return {

        getQuizProgress: quizProgress,

        getQuestionLocalStorage: questionLocalStorage,

        addQuestionOnLocalStorage: function (newQuestText, opts) {
            // dobrze jest wpierw deklarować zmienne, a później przypisywać - lepiej widoczne

            var optionsArr, corrAns, questionId, newQuestion, getStoredQuests, isChecked;   // zmienna do przetrzymywania tresci opcji, prawidłowa odpowiedź


            // localStorage, gdy nie jest stworzony to zwraca null, więc:
            if (questionLocalStorage.getQuestionCollection() === null) {
                questionLocalStorage.setQuestionCollection([]);
            }
            optionsArr = [];

            isChecked = false;

            for (var i = 0; i < opts.length; i++) {
                if (opts[i].value != "") {
                    optionsArr.push(opts[i].value);
                }
                // radio buttons są previous sibiling względem treści odpowiedzi
                if (opts[i].previousElementSibling.checked && opts[i].value !== "") {
                    corrAns = opts[i].value;
                    isChecked = true;
                }
            }

            // set id
            getStoredQuests = questionLocalStorage.getQuestionCollection();
            if (getStoredQuests.length > 0) {
                questionId = getStoredQuests[getStoredQuests.length - 1].id + 1;
            } else {
                questionId = 0;
            }

            if (newQuestText.value !== "") {
                if (optionsArr.length > 1) {
                    if (isChecked) {

                        newQuestion = new Question(questionId, newQuestText.value, optionsArr, corrAns);
                        getStoredQuests.push(newQuestion);
                        questionLocalStorage.setQuestionCollection(getStoredQuests);

                        newQuestText.value = "";
                        for (var x = 0; x < opts.length; x++) {
                            opts[x].value = "";
                            opts[x].previousElementSibling.checked = false;
                        }
                        return true;
                    } else {
                        alert('You forgot to check the correct answer or you checked the answer without value.');
                        return false;
                    }
                } else {
                    alert('You must insert at least two options!');
                    return false;
                }
            } else {
                alert('Please insert question!');
                return false;
            }
        },
        //  addQuestionOnLocalStorage END

        checkAnswer: function (answer) {
            if (questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer === answer.textContent) {
                currPersonData.score++;
                return true;
            } else { return false; }

        },

        isFinished: function () {
            return quizProgress.questionIndex + 1 === questionLocalStorage.getQuestionCollection().length;
        },

        addPerson: function () {
            var newPerson, personId, personData;
            if (personLocalStorage.getPersonData().length > 0) {
                personId = personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length - 1].id + 1;
            } else {
                personId = 0;
            }
            newPerson = new Person(personId, currPersonData.fullname[0], currPersonData.fullname[1], currPersonData.score);
            personData = personLocalStorage.getPersonData();
            personData.push(newPerson);
            personLocalStorage.setPersonData(personData);

            console.log(newPerson);
        },
        getCurrPersonData: currPersonData,
        getAdminFullName: adminFullName,
        getPersonLocalStorage: personLocalStorage
    };

})();


/**********UI CONTROLLER*********/

//3
var UIController = (function () {

    //5
    var domItems = {
        //*******Admin Panel Elements********
        adminPanelSection: document.querySelector('.admin-panel-container'),
        questInsertBtn: document.getElementById('question-insert-btn'), //6 // podpinamy obiekt DOM - insert button
        newQuestionText: document.getElementById('new-question-text'), //15
        adminOptions: document.querySelectorAll('.admin-option'), //16   // są to tresci odpowiedzi
        adminOptionsContainer: document.querySelector(".admin-options-container"),
        insertedQuestsWrapper: document.querySelector('.inserted-questions-wrapper'),
        questUpdateBtn: document.getElementById('question-update-btn'),
        questDeleteBtn: document.getElementById('question-delete-btn'),
        questsClearBtn: document.getElementById('questions-clear-btn'),
        adminResultListWrapper: document.querySelector(".results-list-wrapper"),
        resultsClearBtn: document.getElementById('results-clear-btn'),

        //*******Quiz Section Elements********
        quizSection: document.querySelector('.quiz-container'),
        askedQuestText: document.getElementById('asked-question-text'),
        quizOptionsWrapper: document.querySelector('.quiz-options-wrapper'),
        progressBar: document.querySelector('progress'), // element <progress> - belka postępu
        progressParagraph: document.getElementById('progress'),
        instAnsContainer: document.querySelector(".instant-answer-container"),
        instAnsText: document.getElementById("instant-answer-text"),
        instAnsDiv: document.getElementById("instant-answer-wrapper"),
        emotionIcon: document.getElementById("emotion"),
        nextQuestBtn: document.getElementById("next-question-btn"),

        //*******Landing Page********
        landPageSection: document.querySelector('.landing-page-container'),
        startQuizBtn: document.getElementById('start-quiz-btn'),
        firstNameInput: document.getElementById('firstname'),
        lastNameInput: document.getElementById('lastname'),
        //*******Final Result Section********
        finalResultSection: document.querySelector(".final-result-container"),
        finalScoreText: document.getElementById("final-score-text")
    };

    //7
    return {
        getDomItems: domItems, //8       //dodaliśmy property do UIController z wartością domItems
        // zmienne znajdują się wewnątrz funkcji - są "anonimowe" - my zwracamy obiekt z tymi własciwościami
        addInputsDynamically: function () {
            var addInput = function () {
                var inputHTML, counter;
                counter = document.querySelectorAll('.admin-option').length;

                inputHTML = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + counter + '" name="answer" value="' + counter + '"><input type="text" class="admin-option admin-option-' + counter + '" value=""></div>';
                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);

                // usuwamy event z dawnego ostatniego pytania
                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);
                // i przenosimy na następne, nowoutworzone miejsce
                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener("focus", addInput);
            }
            domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener("focus", addInput);
        },
        // tworzymy listę gotowych pytań - parametr to obiekt z local storage
        createQuestionList: function (getQuestions) {
            var questHTML, numberingArr;    // numberingArr - pozwala nam zmieniać numer kolejnych pytań

            numberingArr = [];  // do numerowania pytań
            domItems.insertedQuestsWrapper.innerHTML = "";  // wpierw czyścimy listę
            for (var i = 0; i < getQuestions.getQuestionCollection().length; i++) {
                numberingArr.push(i + 1);

                questHTML = '<p><span>' + numberingArr[i] + '. ' + getQuestions.getQuestionCollection()[i].questionText + '</span><button id="question-' + getQuestions.getQuestionCollection()[i].id + '">Edit</button></p>';

                domItems.insertedQuestsWrapper.insertAdjacentHTML('afterbegin', questHTML);
            }
        },
        editQuestList: function (event, storageQuestList, addInputsDynFn, updateQuesListFn) {   // addInputsDynFn - aby przy wypełnianu automatycznie dodawal nowe puste pole odpowiedzi - korzystamy z istniejącej funkcji UIController-->addInputsDymamically
            var getId, getStorageQuestList, foundItem, placeInArr, optionHTML;

            if ('question-'.indexOf(event.target.id)) {    // ponieważ question- to część wspólna wszystkich id pól
                getId = parseInt(event.target.id.split('-')[1]);     // pobieramy samo id, które przerabiamy ze string na number
                getStorageQuestList = storageQuestList.getQuestionCollection();
                for (var i = 0; i < getStorageQuestList.length; i++) {
                    if (getStorageQuestList[i].id === getId) {
                        foundItem = getStorageQuestList[i];
                        placeInArr = i;
                    }
                }
                domItems.newQuestionText.value = foundItem.questionText;
                domItems.adminOptionsContainer.innerHTML = '';
                optionHTML = ''; // jeśli byśmy tego nie zrobili to optionHTML miałby wartość "undefined<div class (...)"

                for (var x = 0; x < foundItem.options.length; x++) {
                    optionHTML += '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + x + '" name="answer" value="' + x + '"><input type="text" class="admin-option admin-option-' + x + '" value="' + foundItem.options[x] + '"></div>'
                }
                domItems.adminOptionsContainer.innerHTML = optionHTML;  // wypełniamy pola do edycji
                domItems.questUpdateBtn.style.visibility = 'visible';
                domItems.questDeleteBtn.style.visibility = 'visible';
                domItems.questInsertBtn.style.visibility = 'hidden';
                domItems.questsClearBtn.style.pointerEvents = 'none';

                addInputsDynFn();

                var backDefaultView = function () {
                    var updatedOptions;

                    // wycięty z funkcji updateQuestions
                    domItems.newQuestionText.value = '';

                    updatedOptions = document.querySelectorAll('.admin-option');

                    for (var i = 0; i < updatedOptions.length; i++) {
                        updatedOptions[i].value = '';
                        updatedOptions[i].previousElementSibling.checked = false;
                    }

                    domItems.questUpdateBtn.style.visibility = 'hidden';
                    domItems.questDeleteBtn.style.visibility = 'hidden';
                    domItems.questInsertBtn.style.visibility = 'visible';
                    domItems.questsClearBtn.style.pointerEvents = '';

                    updateQuesListFn(storageQuestList);
                }


                var updateQuestion = function () {
                    var newOptions, optionElements;

                    newOptions = [];
                    optionElements = document.querySelectorAll(".admin-option");

                    foundItem.questionText = domItems.newQuestionText.value;    // podmieniamy tekst starego pytania na nowy
                    foundItem.correctAnswer = '';

                    for (var i = 0; i < optionElements.length; i++) {
                        if (optionElements[i].value !== '') {
                            newOptions.push(optionElements[i].value);
                            if (optionElements[i].previousElementSibling.checked) {
                                foundItem.correctAnswer = optionElements[i].value;
                            }
                        }
                    }

                    foundItem.options = newOptions;

                    if (foundItem.questionText !== '') {
                        if (foundItem.options.length > 1) {
                            if (foundItem.correctAnswer !== '') {
                                getStorageQuestList.splice(placeInArr, 1, foundItem);
                                storageQuestList.setQuestionCollection(getStorageQuestList);

                                backDefaultView();


                            } else {
                                alert('You forgot to check the correct answer or you checked the answer without value.');
                            }
                        } else {
                            alert('You must insert at least two options!');
                        }
                    } else {
                        alert('Please insert question!');
                    }

                }

                domItems.questUpdateBtn.onclick = updateQuestion;

                var deleteQuestion = function () {
                    getStorageQuestList.splice(placeInArr, 1);
                    storageQuestList.setQuestionCollection(getStorageQuestList);
                    console.log("dupa");
                    backDefaultView();

                }
                domItems.questDeleteBtn.onclick = deleteQuestion;
            }
        },

        clearQuestionList: function (storageQuestList) {
            if (storageQuestList.getQuestionCollection() !== null) {    // aby wyeliminować błąd powstały w wyniku powtórnego kliknięcia clear list, gdy lista jest pusta
                // a strona nie jest przeładowana
                if (storageQuestList.getQuestionCollection().length > 0) {
                    var conf = confirm('Warning! You will lose entire question list');
                    if (conf) {
                        storageQuestList.removeQuestionCollection();
                        domItems.insertedQuestsWrapper.innerHTML = '';
                    }
                }
            }
        },

        displayQuestion: function (storageQuestList, progress) {
            var newOptionHTML, charArr;
            charArr = ['A', 'B', 'C', 'D', 'E', 'F'];

            if (storageQuestList.getQuestionCollection().length > 0) {
                domItems.askedQuestText.textContent = storageQuestList.getQuestionCollection()[progress.questionIndex].questionText;
                domItems.quizOptionsWrapper.innerHTML = '';

                for (var i = 0; i < storageQuestList.getQuestionCollection()[progress.questionIndex].options.length; i++) {
                    newOptionHTML = '<div class="choice-' + i + '"><span class="choice-' + i + '">' + charArr[i] + '</span><p class="choice-' + i + '">' + storageQuestList.getQuestionCollection()[progress.questionIndex].options[i] + '</p></div>';

                    domItems.quizOptionsWrapper.insertAdjacentHTML('beforeend', newOptionHTML);
                }
            }
        },
        displayProgress: function (storageQuestList, progress) {
            domItems.progressBar.max = storageQuestList.getQuestionCollection().length;
            domItems.progressBar.value = progress.questionIndex + 1;

            domItems.progressParagraph.textContent = (progress.questionIndex + 1) + "/" + storageQuestList.getQuestionCollection().length;
        },

        newDesign: function (ansResult, selectedAnswer) { // design after selecting answer
            var twoOptions, index;

            index = 0;

            if (ansResult) {     // ansResult - checks if our result is correct or not
                index = 1;
            }
            twoOptions = {
                instAnswerText: ['This is a wrong answer', 'This is a correct answer'],
                instAnswerClass: ['red', 'green'],
                emotionType: ['images/sad.png', 'images/happy.png'],
                optionSpanBg: ['rgba(200, 0, 0, .7)', 'rgba(0, 250, 0, .2'],
                optionSpanBorder: ['3px solid #FF0000', '3px solid #00E000'],


            };

            domItems.quizOptionsWrapper.style.cssText = "opacity: 0.6; pointer-events: none;";
            domItems.instAnsContainer.style.opacity = "1";

            domItems.instAnsText.textContent = twoOptions.instAnswerText[index];
            domItems.instAnsDiv.className = twoOptions.instAnswerClass[index];

            domItems.emotionIcon.setAttribute('src', twoOptions.emotionType[index]);
            selectedAnswer.previousElementSibling.style.backgroundColor = twoOptions.optionSpanBg[index];
            selectedAnswer.previousElementSibling.style.border = twoOptions.optionSpanBorder[index];
        },
        resetDesign: function () {
            domItems.quizOptionsWrapper.style.cssText = "";
            domItems.instAnsContainer.style.opacity = "0";
        },

        getFullName: function (currPerson, storageQuestList, admin) {
            if (domItems.firstNameInput.value.trim() !== "" && domItems.lastNameInput.value.trim() !== "") {
                if (!(domItems.firstNameInput.value === admin[0] && domItems.lastNameInput.value === admin[1])) {
                    if(storageQuestList.getQuestionCollection().length > 0){
                        currPerson.fullname.push(domItems.firstNameInput.value);
                        currPerson.fullname.push(domItems.lastNameInput.value);
                        domItems.landPageSection.style.display = 'none';
                        domItems.quizSection.style.display = 'block';
                        console.log('jestem graczem');
                    } else {
                        alert('Quiz is not ready, please contact to administrator');
                    }
                    
                } else {
                    console.log('jestem adminem');
                    domItems.landPageSection.style.display = 'none';
                    domItems.adminPanelSection.style.display = 'block';
                }
            } else {
                alert('Please, enter your first name and last name ');
            }
        },
        finalResult: function(currPerson){
            domItems.finalScoreText.textContent = currPerson.fullname[0] + " " + 
            currPerson.fullname[1] + ', your final score is ' + currPerson.score;

            domItems.quizSection.style.display = 'none';
            domItems.finalResultSection.style.display = 'block';
        },
        addResultOnAdminPanel: function(userData){
            var resultHTML;
            domItems.adminResultListWrapper.innerHTML = "";
            for( var i = 0; i <userData.getPersonData().length; i++){
                // resultHTML += '<p class="person person-' + i + '"><span class="person-' + i +'">' +  userData.getPersonData()[i].firstName + ' '  + userData.getPersonData()[i].lastName + '-'+ userData.getPersonData()[i].score + ' Points</span><button id="delete-result-btn_' + userData.getPersonData()[i].id + '" class="delete-result-btn">Delete</button></p>';
                resultHTML = '<p class="person person-' + i + '"><span class="person-' + i + '">' + userData.getPersonData()[i].firstName + ' ' + userData.getPersonData()[i].lastName + ' - ' + userData.getPersonData()[i].score + ' Points</span><button id="delete-result-btn_' + userData.getPersonData()[i].id + '" class="delete-result-btn">Delete</button></p>';
                domItems.adminResultListWrapper.insertAdjacentHTML('afterbegin', resultHTML);
                
            }
        },

        deleteResult: function(event, userData){
            var id, personArr;
            var dupa = (event.target.id);
            
            personArr = userData.getPersonData();
            console.log(dupa);
            
            if('delete-result-btn_'.indexOf(event.target.id)){      // ?
                id = parseInt(event.target.id.split('_')[1]);
                for(var i = 0; i < personArr.length; i++) {
                    // 359
                    if(personArr[i].id === id) {
                        // 360
                        personArr.splice(i, 1);
                        // 361
                        userData.setPersonData(personArr);
                    }
                }
            }
        },

        clearResults: function(userData){
            console.log('works');
            var accept;
            if(userData.getPersonData !== null){
                if (userdata.getPersonData().length > 0){
                    accept = confirm("Warning! You will lose entire result list");
                    if (accept){
                        domItems.adminResultListWrapper.innerHTML = "";
                        userData.removePersonData();
        
                    }
                }
            }
        }
};

})();

/***********CONTROLLER***********/
//3

var controller = (function (quizCtrl, UICtrl) {

    //11
    var selectedDomItems = UICtrl.getDomItems;

    UICtrl.addInputsDynamically();

    UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);

    selectedDomItems.questInsertBtn.addEventListener('click', function () {
        // znów pobieramy dane, bo dynamicznie dodawane elementy nie sa widziane przez wlaściwości z IIFE
        var adminOptions = document.querySelectorAll('.admin-option');

        var checkBoolean = quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions);
        if (checkBoolean) {
            UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
        }
    });

    selectedDomItems.insertedQuestsWrapper.addEventListener('click', function (e) {
        UICtrl.editQuestList(e, quizCtrl.getQuestionLocalStorage, UICtrl.addInputsDynamically, UIController.createQuestionList);
    });

    selectedDomItems.questsClearBtn.addEventListener('click', function () {
        UICtrl.clearQuestionList(quizCtrl.getQuestionLocalStorage);
    });

    UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

    UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

    selectedDomItems.quizOptionsWrapper.addEventListener('click', function (e) {

        var updatedOptionsDiv = selectedDomItems.quizOptionsWrapper.querySelectorAll('div');

        for (var i = 0; i < updatedOptionsDiv.length; i++) {
            if (e.target.className === 'choice-' + i) {  // wszystkie elementy mają tę samą klasę choice - gdzie nie kliknie, będzie dobrze
                var answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);
                var answerResult = quizCtrl.checkAnswer(answer);

                UICtrl.newDesign(answerResult, answer);

                if (quizCtrl.isFinished()) {
                    selectedDomItems.nextQuestBtn.textContent = 'Finish';
                }

                var nextQuestion = function (questData, progress) {

                    if (quizCtrl.isFinished()) {
                        // Finish Quiz
                        quizCtrl.addPerson();
                        UICtrl.finalResult(quizCtrl.getCurrPersonData);

                    } else {
                        UICtrl.resetDesign();
                        quizCtrl.getQuizProgress.questionIndex++;

                        UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

                        UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
                    }

                }
                selectedDomItems.nextQuestBtn.onclick = function () {
                    nextQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
                }
            }
        }
    });

    selectedDomItems.startQuizBtn.addEventListener('click', function () {
        UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);
    });

    selectedDomItems.lastNameInput.addEventListener('focus', function(){
        selectedDomItems.lastNameInput.addEventListener('keypress', function(e){
            if (e.keyCode === 13){
                UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);
            }
        });
    });

    UICtrl.addResultOnAdminPanel(quizCtrl.getPersonLocalStorage);
    
    selectedDomItems.adminResultListWrapper.addEventListener('click', function (e) {
        UICtrl.deleteResult(e, quizCtrl.getPersonLocalStorage);
        UICtrl.addResultOnAdminPanel(quizCtrl.getPersonLocalStorage);
    });
    
    selectedDomItems.resultsClearBtn.addEventListener('click', function(){
        UICtrl.clearResults(quizCtrl.getPersonLocalStorage);
        UICtrl.addResultOnAdminPanel(quizCtrl.getPersonLocalStorage);
    })

})(quizController, UIController);


