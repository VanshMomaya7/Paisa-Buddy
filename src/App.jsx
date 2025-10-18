import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";
import Credit from "./pages/CreditManagement/Credit";
import FraudDetectionQuiz from "./pages/quiz/FraudDetectionQuiz";
import VirtualSimulator from "./pages/VirtualSimulator/virtualSimulatorNew";
import TestSupabase from "./testSupabase";
import BudgetingTool from "./pages/BudgetTracker/BudgetTracker";
import Chatbot from "./pages/Chat/ChatBot";
// Temporary placeholder until you add a component
function LearningModule() {
  return <h1>Learning Module Page</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/credit" element={<Credit />} />
        <Route path="/quiz" element={<FraudDetectionQuiz />} />
        <Route path="/simulator" element={<VirtualSimulator />} />
        <Route path="/test-supabase" element={<TestSupabase />} />
        <Route path="/budget" element={<BudgetingTool />} />
      </Routes>
      <Chatbot /> {/* global floating chatbot */}
    </BrowserRouter>
  );
}

export default App;
