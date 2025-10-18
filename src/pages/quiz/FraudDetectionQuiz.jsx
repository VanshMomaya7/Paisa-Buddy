import React, { useState } from "react";
import {
  Shield,
  Award,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import ThemeToggle from "../Theme/ThemeToggle";

const FraudDetectionQuiz = () => {
  const [currentQuiz, setCurrentQuiz] = useState("detective");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const detectiveQuestions = [
    {
      id: 1,
      question:
        "You receive a call claiming to be from PhonePe support asking for your PIN to 'verify your account'. What's your move, detective?",
      options: [
        "Share the PIN since they called first",
        "Ask them to verify details about my account first",
        "Hang up immediately and report the number",
      ],
      correct: 2,
      points: 15,
      penalty: -10,
      difficulty: "Easy",
      explanation:
        "Legitimate payment services NEVER ask for PINs or passwords. This is a classic social engineering attack.",
    },
    {
      id: 2,
      question:
        "A WhatsApp message from an unknown number says: 'Congratulations! You've won ₹50,000 in Google Pay lottery! Click here to claim.' Detective instincts say:",
      options: [
        "Click the link - Google Pay does run lotteries",
        "Forward to friends so they can win too",
        "Delete and block - Google Pay doesn't run lotteries",
      ],
      correct: 2,
      points: 20,
      penalty: -15,
      difficulty: "Medium",
      explanation:
        "Google Pay, PhonePe, and other legitimate payment apps don't run random lotteries. This is a phishing scam.",
    },
    {
      id: 3,
      question:
        "You're selling a laptop on OLX. A buyer says 'I'll pay ₹5000 extra, just refund the excess after receiving payment.' Red flag analysis:",
      options: [
        "Great deal! Accept the extra money",
        "Ask why they want to overpay",
        "Decline - this screams overpayment scam",
      ],
      correct: 2,
      points: 25,
      penalty: -20,
      difficulty: "Hard",
      explanation:
        "Overpayment scams involve fake payments. The 'buyer' sends a fake payment screenshot, you refund the 'excess', then discover the original payment never came.",
    },
    {
      id: 4,
      question:
        "Your Paytm shows a transaction of ₹2000 you didn't make. The fraudster calls saying 'Sir, wrong transaction done. Please send ₹2000 back.' Detective move:",
      options: [
        "Send the money back immediately",
        "Check transaction details and contact official Paytm support",
        "Ask for their Paytm details to send money",
      ],
      correct: 1,
      points: 20,
      penalty: -15,
      difficulty: "Medium",
      explanation:
        "Never trust random callers about transactions. Check your actual transaction history and contact official support only.",
    },
    {
      id: 5,
      question:
        "You receive an SMS: 'Your UPI PIN will expire in 2 hours. Click link to renew: upi-renew-secure.com' Case analysis:",
      options: [
        "Click quickly before PIN expires",
        "Forward to family members to warn them",
        "Delete - UPI PINs don't expire automatically",
      ],
      correct: 2,
      points: 15,
      penalty: -10,
      difficulty: "Easy",
      explanation:
        "UPI PINs don't expire automatically. This is a phishing attempt to steal your banking credentials.",
    },
    {
      id: 6,
      question:
        "Someone on Facebook Marketplace offers to buy your phone but says 'My payment method only works if you send me ₹1 first as verification.' Investigation result:",
      options: [
        "Send ₹1 to complete the sale",
        "Ask them to explain why this is needed",
        "Block them - this is an advance fee scam",
      ],
      correct: 2,
      points: 25,
      penalty: -20,
      difficulty: "Hard",
      explanation:
        "Legitimate buyers never ask sellers to send money first. This is an advance fee scam - they'll disappear with your ₹1 and never buy anything.",
    },
    {
      id: 7,
      question:
        "A friend's WhatsApp account messages you: 'Emergency! Need ₹10,000 immediately. Will return tomorrow. Send to this number.' Detective protocol:",
      options: [
        "Send money immediately to help friend",
        "Call your friend directly to verify",
        "Ask for more details via WhatsApp",
      ],
      correct: 1,
      points: 20,
      penalty: -15,
      difficulty: "Medium",
      explanation:
        "WhatsApp accounts get hacked frequently. Always verify emergency money requests through a direct phone call.",
    },
    {
      id: 8,
      question:
        "You get a call: 'Sir, your KYC is not updated. Your bank account will be blocked. Press 1 to speak to manager.' Fraud detection level:",
      options: [
        "Press 1 to speak to manager",
        "Provide KYC details to avoid blocking",
        "Hang up and visit bank branch directly",
      ],
      correct: 2,
      points: 15,
      penalty: -10,
      difficulty: "Easy",
      explanation:
        "Banks don't threaten account blocking over phone calls. They send official letters and you can always visit the branch.",
    },
    {
      id: 9,
      question:
        "An email from 'team@googIepay.com' (notice the 'I' instead of 'l') says your account needs verification. Forensic analysis:",
      options: [
        "Click the verification link",
        "Reply with account details",
        "Report as phishing - domain is fake",
      ],
      correct: 2,
      points: 25,
      penalty: -20,
      difficulty: "Hard",
      explanation:
        "This is domain spoofing. The real domain is 'googlepay.com' not 'googIepay.com'. Always check sender domains carefully.",
    },
    {
      id: 10,
      question:
        "A QR code at a restaurant has fallen off and someone helpfully points to a 'replacement' QR code they're holding. Security assessment:",
      options: [
        "Scan the helpful person's QR code",
        "Ask restaurant staff for official QR code",
        "Pay with cash instead",
      ],
      correct: 1,
      points: 20,
      penalty: -15,
      difficulty: "Medium",
      explanation:
        "QR code swapping is a common scam. Always verify QR codes with official staff - the 'helpful' person might redirect payments to their account.",
    },
  ];

  const mobileGameQuestions = [
    {
      id: 1,
      scenario:
        "🚨 SCAM ALERT! You receive an SMS: 'Urgent! Your Paytm wallet will be blocked in 1 hour. Click here to verify: paytm-verify.net'",
      actions: [
        "Click the link immediately to avoid blocking",
        "Forward the message to friends as a warning",
        "Delete the SMS - Paytm uses official domain paytm.com",
      ],
      correct: 2,
      explanation:
        "Official Paytm domain is paytm.com, not paytm-verify.net. Delete suspicious links!",
    },
    {
      id: 2,
      scenario:
        "💸 MONEY TRAP! Someone on Instagram DMs: 'I can double any money you send me using a PhonePe glitch. Send ₹1000, get ₹2000 back!'",
      actions: [
        "Send ₹500 first to test if it works",
        "Ask for proof before sending money",
        "Block and report - no such 'glitch' exists",
      ],
      correct: 2,
      explanation:
        "There are no 'glitches' that double money. These are advance fee scams. Block immediately!",
    },
    {
      id: 3,
      scenario:
        "📞 FAKE CALL! Caller says: 'I'm calling from Google Pay security. Someone tried to hack your account. Share your OTP to secure it.'",
      actions: [
        "Share the OTP to secure the account",
        "Ask them to verify their identity first",
        "Hang up - Google Pay never calls for OTPs",
      ],
      correct: 2,
      explanation:
        "Never share OTPs with anyone! Google Pay will never call asking for OTPs.",
    },
    {
      id: 4,
      scenario:
        "🛒 SHOPPING SCAM! An online seller says: 'Pay 50% advance via UPI, remaining on delivery.' Product price seems too good to be true.",
      actions: [
        "Pay advance since it's a great deal",
        "Negotiate for cash on delivery only",
        "Use trusted platforms with buyer protection",
      ],
      correct: 2,
      explanation:
        "If deals seem too good to be true, they usually are. Use trusted platforms with return policies!",
    },
    {
      id: 5,
      scenario:
        "🎯 INVESTMENT TRAP! WhatsApp group admin says: 'Join our cryptocurrency investment. Guaranteed 500% returns in 30 days. Send money via Google Pay.'",
      actions: [
        "Invest a small amount to test",
        "Ask for company registration documents",
        "Exit the group - guaranteed returns don't exist",
      ],
      correct: 2,
      explanation:
        "No investment can guarantee such high returns. These are Ponzi schemes. Stay away!",
    },
    {
      id: 6,
      scenario:
        "🔐 ACCOUNT HIJACK! You get an email: 'Suspicious activity detected on your PhonePe. Click here to change password: phonepe-security-update.org'",
      actions: [
        "Click the link to change password",
        "Reply to the email asking for more details",
        "Open PhonePe app directly to check account",
      ],
      correct: 2,
      explanation:
        "Always open the official app directly. Never click links in suspicious emails!",
    },
    {
      id: 7,
      scenario:
        "💳 CARD CLONE! ATM security guard offers to 'help' you with your transaction and asks to see your card and PIN 'for verification.'",
      actions: [
        "Show the card since they're trying to help",
        "Let them enter PIN while you watch",
        "Politely decline and use ATM independently",
      ],
      correct: 2,
      explanation:
        "Never share your card or PIN with anyone, even 'helpful' security guards. They might be scammers!",
    },
  ];

  const currentData =
    currentQuiz === "detective" ? detectiveQuestions : mobileGameQuestions;

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const [showNextButton, setShowNextButton] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const question = currentData[currentQuestion];
    const isCorrect = selectedAnswer === question.correct;

    if (currentQuiz === "detective") {
      if (isCorrect) {
        setScore(score + question.points);
        showPointsAnimation(`+${question.points}`, "positive");
      } else {
        setScore(score + question.penalty);
        showPointsAnimation(`${question.penalty}`, "negative");
      }
    } else {
      if (isCorrect) {
        setScore(score + 10);
        showPointsAnimation("+10", "positive");
      }
    }

    setShowExplanation(true);

    // Different timing based on correct/wrong answer
    const waitTime = isCorrect ? 5000 : 60000; // 5s for correct, 60s for wrong
    setTimeLeft(Math.floor(waitTime / 1000));

    // Show next button immediately for wrong answers after 10 seconds
    if (!isCorrect) {
      setTimeout(() => {
        setShowNextButton(true);
      }, 10000);
    }

    // Auto advance after the wait time
    const timer = setTimeout(() => {
      handleNextQuestion();
    }, waitTime);

    // Countdown timer
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Store timer reference for manual next
    window.currentTimer = timer;
    window.currentCountdown = countdown;
  };

  const handleNextQuestion = () => {
    // Clear any existing timers
    if (window.currentTimer) clearTimeout(window.currentTimer);
    if (window.currentCountdown) clearInterval(window.currentCountdown);

    if (currentQuestion < currentData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setShowNextButton(false);
      setTimeLeft(0);
    } else {
      setQuizCompleted(true);
    }
  };

  const showPointsAnimation = (points, type) => {
    // This would typically create a floating animation, simplified for this example
    console.log(`${type === "positive" ? "✅" : "❌"} ${points} points`);
  };

  const restartQuiz = () => {
    // Clear any existing timers
    if (window.currentTimer) clearTimeout(window.currentTimer);
    if (window.currentCountdown) clearInterval(window.currentCountdown);

    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizCompleted(false);
    setShowNextButton(false);
    setTimeLeft(0);
  };

  const switchQuiz = (quizType) => {
    setCurrentQuiz(quizType);
    restartQuiz();
  };

  if (quizCompleted) {
    const maxScore =
      currentQuiz === "detective"
        ? detectiveQuestions.reduce((sum, q) => sum + q.points, 0)
        : mobileGameQuestions.length * 10;

    const percentage = Math.round((score / maxScore) * 100);

    let message = "";
    if (percentage >= 90) message = "🏆 Master Detective! You're fraud-proof!";
    else if (percentage >= 70) message = "🕵️ Good Detective! Stay vigilant!";
    else if (percentage >= 50) message = "⚠️ Cadet Detective! Keep learning!";
    else message = "🚨 Rookie Alert! Practice more!";

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 p-4 w-[50vw]">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden w-[100vw]">
          <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
            <div className="bg-white/20 rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-4">
              <span className="text-4xl font-bold">{score}</span>
            </div>
            <h3 className="text-xl mb-4">{message}</h3>
            <div className="space-x-4">
              <button
                onClick={restartQuiz}
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={() =>
                  switchQuiz(
                    currentQuiz === "detective" ? "mobile" : "detective"
                  )
                }
                className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors"
              >
                Try Other Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = currentData[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br bg-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-4 transition-colors duration-300 w-[99vw]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-6 transition-colors duration-300">
          <div className="bg-gradient-to-r from-red-500 to-pink-600 dark:from-red-600 dark:to-pink-700 text-white p-6 transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8" />
                <h1 className="text-2xl font-bold">
                  {currentQuiz === "detective"
                    ? "Fraud Detective Challenge"
                    : "Fraud Defense Game"}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle className="text-white hover:bg-white/10" />
                <div className="text-right">
                  <div className="text-sm opacity-90">Score</div>
                  <div className="text-2xl font-bold">{score}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm opacity-90">
                Question {currentQuestion + 1} of {currentData.length}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => switchQuiz("detective")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    currentQuiz === "detective"
                      ? "bg-white text-red-600 dark:text-red-700"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  Detective Mode
                </button>
                <button
                  onClick={() => switchQuiz("mobile")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    currentQuiz === "mobile"
                      ? "bg-white text-red-600 dark:text-red-700"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  Mobile Game
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transition-colors duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 dark:bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-300">
                {currentQuestion + 1}
              </div>
              {currentQuiz === "detective" && (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    question.difficulty === "Easy"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                      : question.difficulty === "Medium"
                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                      : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                  } transition-colors duration-300`}
                >
                  {question.difficulty} • {question.points > 0 ? "+" : ""}
                  {question.points} pts
                </span>
              )}
              {currentQuiz === "mobile" && (
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-semibold transition-colors duration-300">
                  +10 points for correct answer
                </span>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 leading-relaxed transition-colors duration-300">
              {currentQuiz === "detective"
                ? question.question
                : question.scenario}
            </h2>
          </div>

          <div className="space-y-4 mb-8">
            {question.options
              ? question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      !showExplanation && handleAnswerSelect(index)
                    }
                    disabled={showExplanation}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-4 ${
                      showExplanation
                        ? index === question.correct
                          ? "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          : selectedAnswer === index
                          ? "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                          : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        : selectedAnswer === index
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 shadow-md"
                        : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-gray-800 dark:text-gray-200 dark:hover:bg-blue-800 dark:focus:bg-blue-800 dark:active:bg-blue-800"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors duration-200 ${
                        showExplanation
                          ? index === question.correct
                            ? "bg-green-500 text-white"
                            : selectedAnswer === index
                            ? "bg-red-500 text-white"
                            : "bg-gray-400 dark:bg-gray-600 text-white"
                          : selectedAnswer === index
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                    {showExplanation && index === question.correct && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                    {showExplanation &&
                      selectedAnswer === index &&
                      index !== question.correct && (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                  </button>
                ))
              : question.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      !showExplanation && handleAnswerSelect(index)
                    }
                    disabled={showExplanation}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-4 ${
                      showExplanation
                        ? index === question.correct
                          ? "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          : selectedAnswer === index
                          ? "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                          : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        : selectedAnswer === index
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 shadow-md"
                        : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors duration-200 ${
                        showExplanation
                          ? index === question.correct
                            ? "bg-green-500 text-white"
                            : selectedAnswer === index
                            ? "bg-red-500 text-white"
                            : "bg-gray-400 dark:bg-gray-600 text-white"
                          : selectedAnswer === index
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{action}</span>
                    {showExplanation && index === question.correct && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                    {showExplanation &&
                      selectedAnswer === index &&
                      index !== question.correct && (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                  </button>
                ))}
          </div>

          {!showExplanation && (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 dark:hover:from-purple-600 dark:hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Award className="w-5 h-5" />
              <span>Submit Answer</span>
            </button>
          )}

          {showExplanation && (
            <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-6 rounded-r-xl transition-colors duration-300">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 transition-colors duration-300">
                    Explanation:
                  </h3>
                  <p className="text-blue-700 dark:text-blue-200 transition-colors duration-300">
                    {question.explanation}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-blue-600 dark:text-blue-400 transition-colors duration-300">
                      {timeLeft > 0 ? (
                        selectedAnswer === question.correct ? (
                          <>
                            Moving to next question in{" "}
                            <span className="font-semibold">
                              {timeLeft} seconds
                            </span>
                            ...
                          </>
                        ) : (
                          <>
                            Take time to read the explanation. Auto-advance in{" "}
                            <span className="font-semibold">
                              {timeLeft} seconds
                            </span>
                          </>
                        )
                      ) : (
                        "Ready for next question!"
                      )}
                    </div>
                    {showNextButton && (
                      <button
                        onClick={handleNextQuestion}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center space-x-2"
                      >
                        <span>Next Question</span>
                        <span>→</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FraudDetectionQuiz;
