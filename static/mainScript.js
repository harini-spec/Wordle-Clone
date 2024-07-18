const words = ["HELLO", "SMART", "SWEET", "HEART", "RESIN", "FORCE", "ALARM", "SWEAR", "SWEAT", "SWEET", "SWEPT", "SWEEP", "SWELL", "SWIFT", "SWINE", "SWING", "SWIPE", "SWIRL", "SWISH", "SWISS", "SWORN", "SWUNG"]
const word = words[Math.floor(Math.random() * words.length)]
var current_row = 0
var current_col = 0
var current_str = ""
var found = false

var close_guesses_msg = ["Phew", "That was so close!", "Finally!",
                        "Just in time!", "You made it!",
                        "Phew, that was close!", "Great finish!",
                        "You got it just in time!",
                        "Saved by the bell!"]
var early_guesses_msg = ["Great job!", "You got it!", "Well done!",
                        "Correct!", "Spot on!", "Nailed it!",
                        "Bravo!", "Perfect guess!", "Excellent!",
                        "You did it!", "Right answer!", "That's it!",
                        "Fantastic!", "Bingo!", "Congratulations!"]
var incorrect_msg = ["So close!", "Better luck next time!",
                    "Almost had it", "Don't give up!",
                    "Good effort!", "Nice try, but no.", 
                    "Not quite, try again next time!",
                    "It was a tough one!"]

console.log(word)

document.addEventListener('keydown', (e) => {
    displayLetter(e.key.toUpperCase())
});

const loadToastr = () => {
    toastr.options = 
    {"positionClass": "toast-top-center",
    "showDuration": "5000"}
}

const loadGuessContainer = () => {
    var guess_container = document.querySelector('.guess_container')
    container_text = ""
    for(var i=0;i<6;i++){
        container_text += `<div class='guess-${i}'>
                            <div class="row">
                                <div class="col">
                                </div>
                                <div class="col">
                                </div>
                                <div class="col">
                                </div>
                                <div class="col">
                                </div>
                                <div class="col">
                                </div>
                            </div>
                        </div>`
    }
    var guesses = document.createElement('div')
    guesses.innerHTML = container_text
    guess_container.appendChild(guesses)
}

const displayLetter = (letter) => {
    if(found || letter==" ") return
    if(letter.length == 1){
        if(current_col < 5 && current_row < 6){
            var guess = document.querySelector(`.guess-${current_row}`)
            var cols = guess.querySelectorAll('.col')
            cols[current_col].innerHTML = letter
            cols[current_col].classList.add("active_container")
            current_col++
            current_str += letter 
        }
    }
    else if(letter=="BACKSPACE"){
        if(current_col > 0){
            current_col--
            var guess = document.querySelector(`.guess-${current_row}`)
            var cols = guess.querySelectorAll('.col')
            cols[current_col].innerHTML = ""
            cols[current_col].classList.remove("active_container")
            current_str = current_str.slice(0, -1)
        }
    }
    else if(letter=="ENTER"){
        if(current_col == 5){
            validateWord()
        }
    }
}

const MarkDivs = (col, classname) => {
    col.classList.remove("active_container")
    col.classList.add(classname)
    var elem = document.getElementById(col.innerHTML)
    if(elem.classList.contains("keyboard_correct_pos"))
        return 
    else if(elem.classList.contains("keyboard_correct_char") && classname == "correct_pos"){
        elem.classList.remove("keyboard_correct_char")
        elem.classList.add("keyboard_"+classname)
    }
    else if(elem.classList.contains("keyboard_wrong_char") && (classname == "correct_pos" || classname == "correct_char")){
        elem.classList.remove("keyboard_wrong_char")
        elem.classList.add("keyboard_"+classname)
    }
    else{
        elem.classList.add("keyboard_"+classname)
    }
}

const validateWord = () => {
    if(current_row<=5 && !found){
        var guess = document.querySelector(`.guess-${current_row}`)
        var cols = guess.querySelectorAll('.col')
    
        if(current_str == word)
            {
                for(var i=0;i<5;i++){
                    MarkDivs(cols[i], "correct_pos")
                }
                found = true
                if(current_row > 3){
                    var msg = close_guesses_msg[Math.floor(Math.random() * close_guesses_msg.length)]
                    toastr.success(msg, "", {"iconClass": 'toast'})
                }
                else{
                    var msg = early_guesses_msg[Math.floor(Math.random() * early_guesses_msg.length)]
                    toastr.success(msg, "", {"iconClass": 'toast'})
                }
            }
        else{
            if(current_row == 5){
                var msg = incorrect_msg[Math.floor(Math.random() * close_guesses_msg.length)]
                toastr.error("Answer : "+word, msg, {"iconClass": 'toast'})
            }
            for(var i=0;i<5;i++){
                if(word.includes(cols[i].innerHTML) && word.indexOf(cols[i].innerHTML) == i)
                {
                    MarkDivs(cols[i], "correct_pos")
                }
                else if(word.includes(cols[i].innerHTML)){
                    MarkDivs(cols[i], "correct_char")
                }
                else{
                    MarkDivs(cols[i], "wrong_char")
                }
            }
        }
        current_col = 0
        current_row += 1
        current_str = ""
    }
}