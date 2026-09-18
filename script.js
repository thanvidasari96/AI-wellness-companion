/* ================================================= */
/* DATE */
/* ================================================= */

function showTodayDate() {

    const dateElement =
        document.getElementById("todayDate");

    if (!dateElement) return;

    const today = new Date();

    const options = {
        weekday: "long",
        month: "long",
        day: "numeric"
    };

    dateElement.textContent =
        today.toLocaleDateString(
            "en-US",
            options
        );
}


/* ================================================= */
/* DATE KEY */
/* ================================================= */

function getDateKey() {

    const today = new Date();

    return today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");
}


/* ================================================= */
/* MOOD */
/* ================================================= */

let selectedMood = null;


function selectMood(button) {

    const buttons =
        document.querySelectorAll(".mood-btn");

    buttons.forEach(function (btn) {

        btn.classList.remove("selected");

    });


    button.classList.add("selected");


    selectedMood =
        button.dataset.mood;


    updateWellnessScore();
}


/* ================================================= */
/* MOOD SCORE */
/* ================================================= */

function getMoodScore() {

    const scores = {

        happy: 100,

        calm: 90,

        okay: 70,

        stressed: 45,

        tired: 50

    };


    return scores[selectedMood] || 70;
}


/* ================================================= */
/* GET RATING */
/* ================================================= */

function getRating(id) {

    const element =
        document.getElementById(id);

    if (!element) return 3;

    return Number(element.value);
}


/* ================================================= */
/* WELLNESS SCORE */
/* ================================================= */

function calculateWellnessScore() {

    const moodScore =
        getMoodScore();

    const study =
        getRating("studyRating");

    const sleep =
        getRating("sleepRating");

    const hydration =
        getRating("hydrationRating");

    const breaks =
        getRating("breakRating");


    const studyScore =
        study * 20;

    const sleepScore =
        sleep * 20;

    const hydrationScore =
        hydration * 20;

    const breakScore =
        breaks * 20;


    const score =
        (
            moodScore +
            studyScore +
            sleepScore +
            hydrationScore +
            breakScore
        ) / 5;


    return Math.round(score);
}


/* ================================================= */
/* UPDATE WELLNESS SCORE */
/* ================================================= */

function updateWellnessScore() {

    const score =
        calculateWellnessScore();


    const scoreElement =
        document.getElementById(
            "wellnessScore"
        );


    const circleValue =
        document.getElementById(
            "scoreCircleValue"
        );


    const messageElement =
        document.getElementById(
            "scoreMessage"
        );


    const descriptionElement =
        document.getElementById(
            "scoreDescription"
        );


    if (!scoreElement) return;


    scoreElement.textContent =
        score;


    if (circleValue) {

        circleValue.textContent =
            score;

    }


    if (score >= 80) {

        messageElement.textContent =
            "You're doing great! 🌿";

        descriptionElement.textContent =
            "Your responses show a positive balance today. Keep supporting the habits that are working for you.";

    }

    else if (score >= 60) {

        messageElement.textContent =
            "You're doing okay. 🌱";

        descriptionElement.textContent =
            "A few small improvements could make your day feel more balanced.";

    }

    else {

        messageElement.textContent =
            "Let's take care of today. 💜";

        descriptionElement.textContent =
            "Consider taking a small break and focusing on one simple wellbeing step.";

    }

}


/* ================================================= */
/* STATUS */
/* ================================================= */

function getStatus(value) {

    if (value >= 4) {

        return "Going well";

    }

    if (value === 3) {

        return "Balanced";

    }

    return "Needs attention";

}


/* ================================================= */
/* SAVE CHECK-IN */
/* ================================================= */

function saveCheckin() {

    const score =
        calculateWellnessScore();


    const data = {

        date: getDateKey(),

        score: score,

        mood: selectedMood,

        study:
            getRating("studyRating"),

        sleep:
            getRating("sleepRating"),

        hydration:
            getRating("hydrationRating"),

        breaks:
            getRating("breakRating")

    };


    localStorage.setItem(

        "wellness_" +
        getDateKey(),

        JSON.stringify(data)

    );


    updateFactorStatuses();


    updateWellnessScore();


    alert(
        "Today's check-in has been saved! 🌿"
    );

}


/* ================================================= */
/* FACTOR STATUS */
/* ================================================= */

function updateFactorStatuses() {

    const study =
        getRating("studyRating");

    const sleep =
        getRating("sleepRating");

    const hydration =
        getRating("hydrationRating");

    const breaks =
        getRating("breakRating");


    document.getElementById(
        "studyStatus"
    ).textContent =
        getStatus(study);


    document.getElementById(
        "sleepStatus"
    ).textContent =
        getStatus(sleep);


    document.getElementById(
        "hydrationStatus"
    ).textContent =
        getStatus(hydration);


    document.getElementById(
        "breakStatus"
    ).textContent =
        getStatus(breaks);

}


/* ================================================= */
/* LOAD TODAY DATA */
/* ================================================= */

function loadTodayData() {

    const saved =
        localStorage.getItem(
            "wellness_" +
            getDateKey()
        );


    if (!saved) {

        updateWellnessScore();

        return;

    }


    const data =
        JSON.parse(saved);


    if (data.mood) {

        selectedMood =
            data.mood;


        const moodButton =
            document.querySelector(
                `[data-mood="${data.mood}"]`
            );


        if (moodButton) {

            moodButton.classList.add(
                "selected"
            );

        }

    }


    setRating(
        "studyRating",
        data.study
    );

    setRating(
        "sleepRating",
        data.sleep
    );

    setRating(
        "hydrationRating",
        data.hydration
    );

    setRating(
        "breakRating",
        data.breaks
    );


    updateWellnessScore();

    updateFactorStatuses();

}


/* ================================================= */
/* SET RATING */
/* ================================================= */

function setRating(id, value) {

    const element =
        document.getElementById(id);

    if (element && value) {

        element.value = value;

    }

}


/* ================================================= */
/* WEEKLY DATA */
/* ================================================= */

function getWeeklyData() {

    const data = [];

    const today =
        new Date();


    for (
        let i = 6;
        i >= 0;
        i--
    ) {

        const date =
            new Date(today);


        date.setDate(
            today.getDate() - i
        );


        const key =
            date.getFullYear() +
            "-" +
            String(
                date.getMonth() + 1
            ).padStart(2, "0") +
            "-" +
            String(
                date.getDate()
            ).padStart(2, "0");


        const saved =
            localStorage.getItem(
                "wellness_" + key
            );


        data.push(

            saved
                ? JSON.parse(saved)
                : null

        );

    }


    return data;

}


/* ================================================= */
/* UPDATE INSIGHTS */
/* ================================================= */

function updateInsights() {

    const data =
        getWeeklyData();


    const bars = [

        "barMon",
        "barTue",
        "barWed",
        "barThu",
        "barFri",
        "barSat",
        "barSun"

    ];


    data.forEach(
        function (item, index) {

            const bar =
                document.getElementById(
                    bars[index]
                );


            if (!bar) return;


            if (item) {

                bar.style.height =
                    item.score + "%";

                bar.title =
                    "Wellness Score: " +
                    item.score;

            }

            else {

                /*
                 Sample visual height
                 for days without data.
                */

                const sampleValues = [

                    55,
                    70,
                    45,
                    90,
                    65,
                    80,
                    60

                ];


                bar.style.height =
                    sampleValues[index] + "%";

                bar.title =
                    "Sample data";

            }

        }
    );


    updateWeeklyScore();

    updateBestDay();

    updatePatternAndGoal();

}


/* ================================================= */
/* WEEKLY SCORE */
/* ================================================= */

function updateWeeklyScore() {

    const data =
        getWeeklyData();


    const actualData =
        data.filter(
            item => item !== null
        );


    const scoreElement =
        document.getElementById(
            "weeklyScore"
        );


    const messageElement =
        document.getElementById(
            "weeklyMessage"
        );


    const descriptionElement =
        document.getElementById(
            "weeklyDescription"
        );


    if (!scoreElement) return;


    if (actualData.length === 0) {

        scoreElement.textContent =
            "—";

        messageElement.textContent =
            "Start your week";

        descriptionElement.textContent =
            "Complete daily check-ins to build your wellness trend.";

        return;

    }


    const total =
        actualData.reduce(
            function (sum, item) {

                return sum + item.score;

            },
            0
        );


    const averageScore =
        Math.round(
            total / actualData.length
        );


    scoreElement.textContent =
        averageScore;


    if (averageScore >= 80) {

        messageElement.textContent =
            "A positive week 🌿";

    }

    else if (averageScore >= 60) {

        messageElement.textContent =
            "A balanced week 🌱";

    }

    else {

        messageElement.textContent =
            "Room for small improvements 💜";

    }


    descriptionElement.textContent =
        "Based on " +
        actualData.length +
        " recorded check-in" +
        (actualData.length > 1 ? "s." : ".");

}


/* ================================================= */
/* BEST DAY */
/* ================================================= */

function updateBestDay() {

    const data =
        getWeeklyData();


    const actualData =
        data.filter(
            item => item !== null
        );


    const bestDay =
        document.getElementById(
            "bestDay"
        );


    if (!bestDay) return;


    if (actualData.length === 0) {

        bestDay.textContent =
            "Complete a few daily check-ins to discover your best wellness day.";

        return;

    }


    const best =
        actualData.reduce(
            function (highest, item) {

                return item.score >
                    highest.score
                    ? item
                    : highest;

            }
        );


    const date =
        new Date(
            best.date
        );


    const dayName =
        date.toLocaleDateString(
            "en-US",
            {
                weekday: "long"
            }
        );


    bestDay.textContent =
        dayName +
        " was your strongest recorded day with a wellness score of " +
        best.score +
        ".";

}


/* ================================================= */
/* PATTERN + GOAL */
/* ================================================= */

function updatePatternAndGoal() {

    const data =
        getWeeklyData();


    const actualData =
        data.filter(
            item => item !== null
        );


    const patternElement =
        document.getElementById(
            "patternText"
        );


    const goalElement =
        document.getElementById(
            "goalText"
        );


    const reasonElement =
        document.getElementById(
            "goalReason"
        );


    if (!patternElement) return;


    if (actualData.length < 2) {

        patternElement.textContent =
            "More check-ins are needed to identify a meaningful personal pattern.";

        goalElement.textContent =
            "Complete your daily check-in regularly.";

        reasonElement.textContent =
            "More data helps the companion understand your routine without making assumptions from too little information.";

        return;

    }


    const averages = {

        study: average(
            actualData.map(
                item => item.study
            )
        ),

        sleep: average(
            actualData.map(
                item => item.sleep
            )
        ),

        hydration: average(
            actualData.map(
                item => item.hydration
            )
        ),

        breaks: average(
            actualData.map(
                item => item.breaks
            )
        )

    };


    let weakestFactor =
        "study";


    Object.keys(averages).forEach(
        function (key) {

            if (
                averages[key] <
                averages[weakestFactor]
            ) {

                weakestFactor =
                    key;

            }

        }
    );


    if (weakestFactor === "study") {

        patternElement.textContent =
            "Your study routine is the least consistent factor in your recent check-ins.";

        goalElement.textContent =
            "Plan one clear study task for today.";

        reasonElement.textContent =
            "A simple, focused study target can make your routine easier to manage.";

    }


    else if (
        weakestFactor === "sleep"
    ) {

        patternElement.textContent =
            "Your sleep routine appears less consistent in your recent check-ins.";

        goalElement.textContent =
            "Create a calm and consistent evening routine.";

        reasonElement.textContent =
            "A predictable evening routine may help you build more consistency around rest.";

    }


    else if (
        weakestFactor === "hydration"
    ) {

        patternElement.textContent =
            "Hydration is one of the less consistent factors in your recent check-ins.";

        goalElement.textContent =
            "Make hydration a small priority throughout the day.";

        reasonElement.textContent =
            "Small reminders can make a routine easier to maintain.";

    }


    else {

        patternElement.textContent =
            "Your recent check-ins show that taking breaks is one area that could be more consistent.";

        goalElement.textContent =
            "Take a few short breaks during your day.";

        reasonElement.textContent =
            "Regular pauses can help create a more balanced daily routine.";

    }

}


/* ================================================= */
/* AVERAGE */
/* ================================================= */

function average(numbers) {

    if (
        !numbers ||
        numbers.length === 0
    ) {

        return 0;

    }


    const total =
        numbers.reduce(
            function (sum, number) {

                return sum + number;

            },
            0
        );


    return total / numbers.length;

}


/* ================================================= */
/* AI PROMPTS */
/* ================================================= */

function sendPrompt(prompt) {

    const input =
        document.getElementById(
            "messageInput"
        );


    if (!input) return;


    input.value =
        prompt;


    sendMessage();

}


/* ================================================= */
/* AI RESPONSE */
/* ================================================= */

function getAIResponse(message) {

    const text =
        message.toLowerCase();


    if (
        text.includes("study") ||
        text.includes("plan")
    ) {

        return "Try breaking your study time into small focused tasks. Start with one important topic, study for a while, then take a short break. 📚";

    }


    if (
        text.includes("break")
    ) {

        return "A short pause can help you reset. Step away from your screen, stretch a little, drink some water, and return when you're ready. 🌿";

    }


    if (
        text.includes("organize")
    ) {

        return "Choose your top three priorities for today. Finish the most important one first, then move to the next. ✨";

    }


    if (
        text.includes("positive") ||
        text.includes("motivat")
    ) {

        return "You don't need to do everything perfectly. One small positive step is still progress. 💜";

    }


    return "I'm here to support your everyday wellbeing. You can ask me about studying, breaks, planning your day, or staying balanced. 🤖";

}


/* ================================================= */
/* SEND MESSAGE */
/* ================================================= */

function sendMessage() {

    const input =
        document.getElementById(
            "messageInput"
        );


    const chat =
        document.getElementById(
            "chatArea"
        );


    if (!input || !chat) return;


    const message =
        input.value.trim();


    if (message === "") return;


    const userMessage =
        document.createElement(
            "div"
        );


    userMessage.className =
        "user-message";


    userMessage.textContent =
        message;


    chat.appendChild(
        userMessage
    );


    input.value = "";


    setTimeout(
        function () {

            const aiMessage =
                document.createElement(
                    "div"
                );


            aiMessage.className =
                "ai-message";


            aiMessage.textContent =
                getAIResponse(
                    message
                );


            chat.appendChild(
                aiMessage
            );


            chat.scrollTop =
                chat.scrollHeight;

        },
        400
    );

}


/* ================================================= */
/* ENTER FOR AI */
/* ================================================= */

function handleEnter(event) {

    if (
        event.key === "Enter"
    ) {

        sendMessage();

    }

}


/* ================================================= */
/* VOICE */
/* ================================================= */

function startVoice() {

    alert(
        "Voice support can be connected using the browser's speech recognition API."
    );

}


/* ================================================= */
/* PROFILE */
/* ================================================= */

let selectedAvatar = "👤";


/* OPEN PROFILE */

function editProfile() {

    const modal =
        document.getElementById(
            "profileModal"
        );


    const nameInput =
        document.getElementById(
            "profileNameInput"
        );


    if (!modal) return;


    const savedProfile =
        localStorage.getItem(
            "wellnessProfile"
        );


    if (savedProfile) {

        const profile =
            JSON.parse(
                savedProfile
            );


        nameInput.value =
            profile.name || "";


        selectedAvatar =
            profile.avatar || "👤";


        updateAvatarSelection();

    }


    modal.classList.remove(
        "hidden"
    );


    setTimeout(
        function () {

            nameInput.focus();

        },
        100
    );

}


/* CLOSE PROFILE */

function closeProfile() {

    const modal =
        document.getElementById(
            "profileModal"
        );


    if (!modal) return;


    modal.classList.add(
        "hidden"
    );

}


/* SELECT AVATAR */

function selectAvatar(
    avatar,
    button
) {

    selectedAvatar =
        avatar;


    const buttons =
        document.querySelectorAll(
            ".avatar-option"
        );


    buttons.forEach(
        function (btn) {

            btn.classList.remove(
                "selected"
            );

        }
    );


    button.classList.add(
        "selected"
    );

}


/* UPDATE AVATAR SELECTION */

function updateAvatarSelection() {

    const female =
        document.getElementById(
            "femaleAvatar"
        );


    const male =
        document.getElementById(
            "maleAvatar"
        );


    if (!female || !male) return;


    female.classList.remove(
        "selected"
    );


    male.classList.remove(
        "selected"
    );


    if (
        selectedAvatar === "👩"
    ) {

        female.classList.add(
            "selected"
        );

    }


    if (
        selectedAvatar === "👨"
    ) {

        male.classList.add(
            "selected"
        );

    }

}


/* SAVE PROFILE */

function saveProfile() {

    const nameInput =
        document.getElementById(
            "profileNameInput"
        );


    const name =
        nameInput.value.trim();


    if (name === "") {

        alert(
            "Please enter your name."
        );

        nameInput.focus();

        return;

    }


    const profile = {

        name: name,

        avatar: selectedAvatar

    };


    localStorage.setItem(

        "wellnessProfile",

        JSON.stringify(profile)

    );


    updateProfileOnPage(
        profile
    );


    closeProfile();

}


/* ENTER KEY FOR PROFILE */

function handleProfileEnter(event) {

    if (
        event.key === "Enter"
    ) {

        event.preventDefault();

        saveProfile();

    }

}


/* UPDATE PROFILE ON HOME */

function updateProfileOnPage(
    profile
) {

    const heading =
        document.querySelector(
            ".header h1"
        );


    const avatar =
        document.getElementById(
            "profileAvatar"
        );


    if (heading) {

        heading.textContent =
            "Welcome, " +
            profile.name +
            " 👋";

    }


    if (avatar) {

        avatar.textContent =
            profile.avatar;

    }

}


/* LOAD PROFILE */

function loadProfile() {

    const savedProfile =
        localStorage.getItem(
            "wellnessProfile"
        );


    if (!savedProfile) return;


    const profile =
        JSON.parse(
            savedProfile
        );


    selectedAvatar =
        profile.avatar || "👤";


    updateProfileOnPage(
        profile
    );

}


/* ================================================= */
/* INITIAL LOAD */
/* ================================================= */

showTodayDate();

loadTodayData();

updateInsights();

loadProfile();