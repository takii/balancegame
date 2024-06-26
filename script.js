const questions = [
    {
        question: "하루 중 가장 일이 잘되는 시간?",
        options: [
            { text: "오전", image: "./images/1.webp" },
            { text: "오후", image: "images/2.webp" }
        ]
    },
    {
        question: "하루 중 가장 일이 안되는 시간?",
        options: [
            { text: "오전", image: "images/3.webp" },
            { text: "오후", image: "images/4.webp" }
        ]
    },
    {
        question: "선호하는 회의 방식?",
        options: [
            { text: "DM", image: "images/5.webp" },
            { text: "직접", image: "images/6.webp" },
            { text: "슬랙+준비될때", image: "images/7.webp" }
        ]
    },
    {
        question: "소통은?",
        options: [
            { text: "공개적인 곳에서 모두가", image: "images/8.webp" },
            { text: "관련자들끼리만 빠르게", image: "images/9.webp" }
        ]
    },
    {
        question: "나는 피드백을 받으면 더 잘한다?",
        options: [
            { text: "긍정적", image: "images/10.webp" },
            { text: "부정적", image: "images/11.webp" }
        ]
    },
    {
        question: "자기 계발?",
        options: [
            { text: "업무 관련", image: "images/12.webp" },
            { text: "취미 발전", image: "취미+발전" }
        ]
    },
    {
        question: "갈등 해결?",
        options: [
            { text: "즉시 해결", image: "즉시+해결" },
            { text: "시간을 두고 해결", image: "시간을+두고" }
        ]
    },
    {
        question: "팀 내 의사결정?",
        options: [
            { text: "다수결", image: "다수결" },
            { text: "리더 주도", image: "리더+주도" },
            { text: "합의", image: "합의" }
        ]
    },
    {
        question: "5년 후 나의 모습?",
        options: [
            { text: "전문가", image: "전문가" },
            { text: "관리자", image: "관리자" },
            { text: "창업", image: "창업" }
        ]
    },
    {
        question: "새로운 기술 습득?",
        options: [
            { text: "강의", image: "강의" },
            { text: "책", image: "책" },
            { text: "실무 적용", image: "실무+적용" }
        ]
    },
    {
        question: "실패는 나에게?",
        options: [
            { text: "기회", image: "기회" },
            { text: "피하기", image: "피하기" }
        ]
    },
    {
        question: "아이디어 발상법?",
        options: [
            { text: "브레인 스토밍", image: "브레인+스토밍" },
            { text: "명상", image: "명상" },
            { text: "일상 관찰", image: "일상+관찰" }
        ]
    },
    {
        question: "일이 안될 때?",
        options: [
            { text: "1", image: "1" },
            { text: "2", image: "2" }
        ]
    }
];

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyCdXGUiUKdz5o3tXUMfns5_iB7t5UXhr_g",
    authDomain: "balance-ba185.firebaseapp.com",
    databaseURL: "https://balance-ba185-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "balance-ba185",
    storageBucket: "balance-ba185.appspot.com",
    messagingSenderId: "177431828471",
    appId: "1:177431828471:web:6d6d04f89370ccf75640f2"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let currentQuestion = 0;
let userName = '';

function loadQuestion() {
    if (currentQuestion < questions.length) {
        const q = questions[currentQuestion];
        document.getElementById('question').textContent = q.question;
        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';
        q.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = `w-full sm:w-1/${q.options.length} cursor-pointer transform transition duration-300 ease-in-out hover:scale-105`;
            optionDiv.innerHTML = `
                <img src="${option.image}" alt="Option ${index + 1}" class="w-full h-64 object-cover rounded-lg shadow-lg">
                <p class="mt-4 text-center text-xl font-medium">${option.text}</p>
            `;
            optionDiv.addEventListener('click', () => saveAnswer(option.text));
            optionsContainer.appendChild(optionDiv);
        });
        updateResult(currentQuestion);
        document.getElementById('prevQuestion').classList.toggle('hidden', currentQuestion === 0);
        document.getElementById('nextQuestion').textContent = currentQuestion === questions.length - 1 ? "결과 보기" : "다음 문제";
    } else {
        showFinalResults();
    }
}

function saveAnswer(option) {
    database.ref('answers/' + currentQuestion + '/' + userName).set(option);
    updateResult(currentQuestion);
}

function updateResult(questionIndex) {
    const resultDisplay = document.getElementById('resultDisplay');
    database.ref('answers/' + questionIndex).on('value', (snapshot) => {
        const answers = snapshot.val() || {};
        const options = questions[questionIndex].options;
        let resultHTML = '<div class="bg-gray-100 p-6 rounded-lg">';
        
        options.forEach((option, index) => {
            const count = Object.values(answers).filter(a => a === option.text).length;
            const total = Object.values(answers).length;
            const percent = total > 0 ? Math.round((count / total) * 100) : 0;
            const names = Object.entries(answers).filter(([_, v]) => v === option.text).map(([k, _]) => k).join(', ');
            const color = ['blue', 'red', 'green'][index] || 'gray';

            resultHTML += `
                <div class="mb-4">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-lg">${option.text}</span>
                        <span class="text-lg font-semibold">${count}명 (${percent}%)</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-4 mb-2">
                        <div class="bg-${color}-600 h-4 rounded-full" style="width: ${percent}%"></div>
                    </div>
                    <p class="text-sm">${names}</p>
                </div>
            `;
        });

        resultHTML += '</div>';
        resultDisplay.innerHTML = resultHTML;
    });
}

function showFinalResults() {
    document.getElementById('gameContent').classList.add('hidden');
    document.getElementById('finalResults').classList.remove('hidden');
    const finalResultsList = document.getElementById('finalResultsList');
    finalResultsList.innerHTML = '';

    questions.forEach((q, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'bg-gray-100 p-6 rounded-lg mb-6';
        resultItem.innerHTML = `<h3 class="font-bold text-xl mb-4">${q.question}</h3>`;
        
        const resultDisplay = document.createElement('div');
        resultItem.appendChild(resultDisplay);
        finalResultsList.appendChild(resultItem);

        database.ref('answers/' + index).once('value', (snapshot) => {
            const answers = snapshot.val() || {};
            let resultHTML = '';
            
            q.options.forEach((option, optionIndex) => {
                const count = Object.values(answers).filter(a => a === option.text).length;
                const total = Object.values(answers).length;
                const percent = total > 0 ? Math.round((count / total) * 100) : 0;
                const names = Object.entries(answers).filter(([_, v]) => v === option.text).map(([k, _]) => k).join(', ');
                const color = ['blue', 'red', 'green'][optionIndex] || 'gray';

                resultHTML += `
                    <div class="mb-4">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-lg">${option.text}</span>
                            <span class="text-lg font-semibold">${count}명 (${percent}%)</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-4 mb-2">
                            <div class="bg-${color}-600 h-4 rounded-full" style="width: ${percent}%"></div>
                        </div>
                        <p class="text-sm">${names}</p>
                    </div>
                `;
            });

            resultDisplay.innerHTML = resultHTML;
        });
    });

    // 전체 통계 추가
    const overallStats = document.createElement('div');
    overallStats.className = 'bg-white p-6 rounded-lg mt-8';
    overallStats.innerHTML = '<h3 class="font-bold text-2xl mb-4">전체 통계</h3>';
    
    database.ref('answers').once('value', (snapshot) => {
        const allAnswers = snapshot.val() || {};
        const totalParticipants = Object.keys(allAnswers[0] || {}).length;
        
        overallStats.innerHTML += `<p class="text-lg mb-4">총 참여자 수: ${totalParticipants}명</p>`;
        
        const optionCounts = {};
        Object.values(allAnswers).forEach(questionAnswers => {
            Object.values(questionAnswers).forEach(answer => {
                optionCounts[answer] = (optionCounts[answer] || 0) + 1;
            });
        });
        
        const sortedOptions = Object.entries(optionCounts).sort((a, b) => b[1] - a[1]);
        
        overallStats.innerHTML += '<h4 class="font-bold text-xl mb-2">가장 많이 선택된 옵션:</h4>';
        sortedOptions.slice(0, 3).forEach(([option, count], index) => {
            const percent = Math.round((count / (totalParticipants * questions.length)) * 100);
            overallStats.innerHTML += `
                <div class="mb-2">
                    <span class="text-lg">${index + 1}. ${option}: ${count}회 (${percent}%)</span>
                </div>
            `;
        });
    });
    
    finalResultsList.appendChild(overallStats);
}

document.getElementById('startGame').addEventListener('click', () => {
    userName = document.getElementById('userName').value.trim();
    if (userName) {
        document.getElementById('nameInput').classList.add('hidden');
        document.getElementById('gameContent').classList.remove('hidden');
        loadQuestion();
    } else {
        alert('이름을 입력해주세요.');
    }
});

document.getElementById('prevQuestion').addEventListener('click', () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
});

document.getElementById('nextQuestion').addEventListener('click', () => {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        showFinalResults();
    }
});

document.getElementById('resetGame').addEventListener('click', () => {
    database.ref('answers').remove();
    location.reload();
});

document.getElementById('homeButton').addEventListener('click', () => {
    location.reload();
});

// 입력 필드 애니메이션
const userNameInput = document.getElementById('userName');
const userNameLabel = document.querySelector('label[for="userName"]');

userNameInput.addEventListener('focus', () => {
    userNameLabel.classList.add('text-sm', '-top-3', 'left-2', 'bg-white', 'px-1', 'text-purple-500');
});

userNameInput.addEventListener('blur', () => {
    if (userNameInput.value === '') {
        userNameLabel.classList.remove('text-sm', '-top-3', 'left-2', 'bg-white', 'px-1', 'text-purple-500');
    }
});

// 초기 로드
window.addEventListener('load', () => {
    loadQuestion();
});