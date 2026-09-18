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
        today.toLocaleDateString("en-US", options);
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

    const score =
        (
            moodScore +
            study * 20 +
            sleep * 20 +
            hydration * 20 +
            breaks * 20
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
        document.getElementById("wellnessScore");

    const circleValue =
        document.getElementById("scoreCircleValue");

    const messageElement =
        document.getElementById("scoreMessage");

    const descriptionElement =
        document.getElementById("scoreDescription");

    if (!scoreElement) return;

    scoreElement.textContent =
        score;

    if (circleValue) {
        circleValue.textContent =
            score;
    }

    if (messageElement && descriptionElement) {

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

        study: getRating("studyRating"),

        sleep: getRating("sleepRating"),

        hydration: getRating("hydrationRating"),

        breaks: getRating("breakRating")

    };

    localStorage.setItem(
        "wellness_" + getDateKey(),
        JSON.stringify(data)
    );

    updateFactorStatuses();

    updateWellnessScore();

    updateInsights();

    alert(
        "Today's check-in has been saved! 🌿"
    );
}


/* ================================================= */
/* FACTOR STATUS */
/* ================================================= */

function updateFactorStatuses() {

    const factors = [

        ["studyRating", "studyStatus"],
        ["sleepRating", "sleepStatus"],
        ["hydrationRating", "hydrationStatus"],
        ["breakRating", "breakStatus"]

    ];

    factors.forEach(function (item) {

        const rating =
            getRating(item[0]);

        const status =
            document.getElementById(item[1]);

        if (status) {
            status.textContent =
                getStatus(rating);
        }

    });

}


/* ================================================= */
/* SET RATING */
/* ================================================= */

function setRating(id, value) {

    const element =
        document.getElementById(id);

    if (element && value !== undefined) {
        element.value = value;
    }

}


/* ================================================= */
/* LOAD TODAY DATA */
/* ================================================= */

function loadTodayData() {

    const saved =
        localStorage.getItem(
            "wellness_" + getDateKey()
        );

    if (!saved) {

        updateWellnessScore();
        updateFactorStatuses();

        return;
    }

    try {

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

                document
                    .querySelectorAll(".mood-btn")
                    .forEach(function (btn) {

                        btn.classList.remove(
                            "selected"
                        );

                    });

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

    catch (error) {

        console.log(
            "Could not load today's wellness data."
        );

    }

}


/* ================================================= */
/* WEEKLY SAMPLE DATA */
/* ================================================= */

const sampleWeeklyScores = [

    68,
    76,
    72,
    84,
    79,
    88,
    82

];


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

    data.forEach(function (item, index) {

        const bar =
            document.getElementById(
                bars[index]
            );

        if (!bar) return;

        const score =
            item
                ? item.score
                : sampleWeeklyScores[index];

        bar.style.height =
            score + "%";

        bar.title =
            item
                ? "Wellness Score: " + score
                : "Sample Wellness Score: " + score;

    });


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


    /*
       If there is no real data yet,
       use sample data for the prototype.
    */

    const actualData =
        data.filter(
            item => item !== null
        );


    if (actualData.length === 0) {

        const sampleAverage =
            Math.round(
                sampleWeeklyScores.reduce(
                    function (sum, value) {
                        return sum + value;
                    },
                    0
                ) /
                sampleWeeklyScores.length
            );

        scoreElement.textContent =
            sampleAverage;


        if (messageElement) {

            messageElement.textContent =
                "Your week is looking positive 🌿";

        }


        if (descriptionElement) {

            descriptionElement.textContent =
                "Sample wellness data is shown until you record your own daily check-ins.";

        }

        return;

    }


    /*
       Once the user saves real check-ins,
       calculate the weekly score from
       the real data.
    */

    const total =
        actualData.reduce(
            function (sum, item) {

                return sum + Number(item.score);

            },
            0
        );

    const averageScore =
        Math.round(
            total / actualData.length
        );

    scoreElement.textContent =
        averageScore;


    if (messageElement) {

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

    }


    if (descriptionElement) {

        descriptionElement.textContent =
            "Based on " +
            actualData.length +
            " recorded check-in" +
            (actualData.length > 1 ? "s." : ".");

    }

}


/* ================================================= */
/* BEST DAY */
/* ================================================= */

function updateBestDay() {

    const bestDay =
        document.getElementById(
            "bestDay"
        );

    if (!bestDay) return;

    const data =
        getWeeklyData();

    const actualData =
        data.filter(
            item => item !== null
        );


    /*
       Show sample best day
       before real check-ins exist.
    */

    if (actualData.length === 0) {

        const highest =
            Math.max(
                ...sampleWeeklyScores
            );

        const bestIndex =
            sampleWeeklyScores.indexOf(
                highest
            );

        const days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ];

        bestDay.textContent =
            days[bestIndex] +
            " is your strongest sample day with a wellness score of " +
            highest +
            ".";

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
        new Date(best.date);


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


    const data =
        getWeeklyData();

    const actualData =
        data.filter(
            item => item !== null
        );


    /*
       Sample prototype content
       before enough real data exists.
    */

    if (actualData.length < 2) {

        patternElement.textContent =
            "Your recent routine shows that keeping study and rest balanced can support a steadier wellness score.";

        goalElement.textContent =
            "Keep one clear study goal and take regular short breaks today.";

        reasonElement.textContent =
            "This sample insight demonstrates how the companion can turn daily wellness data into a simple personal goal.";

        return;

    }


    const averages = {

        study: average(
            actualData.map(
                item => Number(item.study)
            )
        ),

        sleep: average(
            actualData.map(
                item => Number(item.sleep)
            )
        ),

        hydration: average(
            actualData.map(
                item => Number(item.hydration)
            )
        ),

        breaks: average(
            actualData.map(
                item => Number(item.breaks)
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

    else if (weakestFactor === "sleep") {

        patternElement.textContent =
            "Your sleep routine appears less consistent in your recent check-ins.";

        goalElement.textContent =
            "Create a calm and consistent evening routine.";

        reasonElement.textContent =
            "A predictable evening routine may help you build more consistency around rest.";

    }

    else if (weakestFactor === "hydration") {

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
/* AI QUICK PROMPTS */
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

        return "Try choosing one important topic first. Study it in a focused block, then take a short break before moving to the next task. 📚";

    }


    if (
        text.includes("break")
    ) {

        return "Take a short pause away from your screen. Stretch, drink some water, and come back when you feel ready. 🌿";

    }


    if (
        text.includes("organize") ||
        text.includes("day")
    ) {

        return "Start with your top three priorities. Give each one a realistic time slot and leave a little space for breaks. ✨";

    }


    if (
        text.includes("positive") ||
        text.includes("motivat")
    ) {

        return "You don't have to do everything at once. One small step forward is still progress. 💜";

    }


    if (
        text.includes("sleep") ||
        text.includes("tired")
    ) {

        return "A consistent evening routine can help. Try finishing important tasks earlier and giving yourself some quiet time before bed. 🌙";

    }


    if (
        text.includes("stress") ||
        text.includes("stressed")
    ) {

        return "When things feel stressful, pause and focus on one small task at a time. A short break and some slow breathing may help you reset. 🌿";

    }


    if (
        text.includes("water") ||
        text.includes("hydration")
    ) {

        return "Keep water nearby during the day and take regular small sips. 💧";

    }


    return "I'm here to support your everyday wellbeing. You can ask me about studying, breaks, planning, sleep, hydration, or staying balanced. 🤖";

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


    /*
       USER MESSAGE
    */

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


    /*
       AI RESPONSE
    */

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

        event.preventDefault();

        sendMessage();

    }

}


/* ================================================= */
/* VOICE */
/* ================================================= */

function startVoice() {

    const input =
        document.getElementById(
            "messageInput"
        );

    if (!input) return;

    input.focus();

    input.placeholder =
        "Voice input can be connected here...";

}


/* ================================================= */
/* PROFILE */
/* ================================================= */

let selectedAvatar = "👤";


/* ================================================= */
/* OPEN PROFILE */
/* ================================================= */

function editProfile() {

    const modal =
        document.getElementById(
            "profileModal"
        );

    const nameInput =
        document.getElementById(
            "profileNameInput"
        );

    if (!modal || !nameInput) return;


    const savedProfile =
        localStorage.getItem(
            "wellnessProfile"
        );


    if (savedProfile) {

        try {

            const profile =
                JSON.parse(
                    savedProfile
                );

            nameInput.value =
                profile.name || "";

            selectedAvatar =
                profile.avatar || "👤";

        }

        catch (error) {

            nameInput.value = "";

            selectedAvatar = "👤";

        }

    }


    updateAvatarSelection();


    /*
       IMPORTANT:
       Use the CSS "show" class.
    */

    modal.classList.add(
        "show"
    );

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


/* ================================================= */
/* CLOSE PROFILE */
/* ================================================= */

function closeProfile() {

    const modal =
        document.getElementById(
            "profileModal"
        );

    if (!modal) return;


    modal.classList.remove(
        "show"
    );

    modal.classList.add(
        "hidden"
    );

}


/* ================================================= */
/* SELECT AVATAR */
/* ================================================= */

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


    if (button) {

        button.classList.add(
            "selected"
        );

    }

}


/* ================================================= */
/* UPDATE AVATAR SELECTION */
/* ================================================= */

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


    if (selectedAvatar === "👩") {

        female.classList.add(
            "selected"
        );

    }


    if (selectedAvatar === "👨") {

        male.classList.add(
            "selected"
        );

    }

}


/* ================================================= */
/* SAVE PROFILE */
/* ================================================= */

function saveProfile() {

    const nameInput =
        document.getElementById(
            "profileNameInput"
        );

    if (!nameInput) return;


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

        avatar:
            selectedAvatar

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


/* ================================================= */
/* PROFILE ENTER KEY */
/* ================================================= */

function handleProfileEnter(event) {

    if (
        event.key === "Enter"
    ) {

        event.preventDefault();

        saveProfile();

    }

}


/* ================================================= */
/* UPDATE PROFILE */
/* ================================================= */

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


/* ================================================= */
/* LOAD PROFILE */
/* ================================================= */

function loadProfile() {

    const savedProfile =
        localStorage.getItem(
            "wellnessProfile"
        );

    if (!savedProfile) return;


    try {

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

    catch (error) {

        console.log(
            "Could not load profile."
        );

    }

}


/* ================================================= */
/* INITIAL LOAD */
/* ================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        showTodayDate();

        loadTodayData();

        updateInsights();

        loadProfile();

    }
);