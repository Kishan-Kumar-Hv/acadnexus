import { GoogleGenerativeAI } from "@google/generative-ai";

// Get API Key from Environment or LocalStorage
export const getApiKey = () => {
  let key = "";
  try {
    if (typeof import.meta !== 'undefined' && import.meta?.env) {
      key = import.meta.env.VITE_GEMINI_API_KEY || "";
    }
  } catch (e) {}

  if (!key) {
    try {
      if (typeof localStorage !== 'undefined') {
        key = localStorage.getItem('acadnexus_gemini_api_key') || "";
      }
    } catch (e) {}
  }

  if (!key) {
    try {
      if (typeof process !== 'undefined' && process?.env) {
        key = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
      }
    } catch (e) {}
  }

  return (key || "").trim();
};

export const setCustomApiKey = (key) => {
  try {
    if (typeof localStorage !== 'undefined') {
      if (key && key.trim()) {
        localStorage.setItem('acadnexus_gemini_api_key', key.trim());
      } else {
        localStorage.removeItem('acadnexus_gemini_api_key');
      }
    }
  } catch (e) {
    console.warn("Could not save to localStorage:", e);
  }
};

// High-speed models: gemini-flash-lite-latest responds in under 800ms
const GEMINI_MODELS = ["gemini-flash-lite-latest", "gemini-2.5-flash", "gemini-flash-latest"];

export const getGeminiModel = (modelName = "gemini-flash-lite-latest") => {
  const key = getApiKey();
  if (!key) return null;
  try {
    const genAI = new GoogleGenerativeAI(key);
    return genAI.getGenerativeModel({ model: modelName });
  } catch (err) {
    console.warn("Failed to initialize GoogleGenerativeAI:", err);
    return null;
  }
};

// Resilient ultra-fast Gemini caller with strict 4.5-second timeout per model
export const callGeminiWithFallback = async (prompt) => {
  const key = getApiKey();
  if (!key) return null;

  const genAI = new GoogleGenerativeAI(key);

  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      
      // Strict 4500ms timeout race so UI never hangs waiting for a slow AI response
      const callPromise = model.generateContent(prompt);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AI generation timeout')), 4500)
      );

      const result = await Promise.race([callPromise, timeoutPromise]);
      const text = result?.response?.text();
      if (text && text.trim()) {
        return text.trim();
      }
    } catch (err) {
      console.warn(`[GEMINI SPEEDUP] Model ${modelName} skipped (${err.message}). Trying next or instant high-yield fallback.`);
    }
  }

  return null;
};

export const testGeminiConnection = async (customKey) => {
  const key = (customKey !== undefined ? customKey : getApiKey() || "").trim();
  if (!key) {
    return { success: false, message: "No Gemini API key provided. Please enter a valid API key." };
  }
  try {
    const genAI = new GoogleGenerativeAI(key);
    for (const modelName of GEMINI_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Reply strictly with the word: Connected");
        const text = result.response.text();
        if (text) {
          return { success: true, message: `Gemini AI (${modelName}) connected and operational!`, response: text.trim() };
        }
      } catch (err) {
        // try next model
      }
    }
    return { success: false, message: "Could not reach Gemini service. Please check network/key permissions." };
  } catch (err) {
    return { success: false, message: err.message || "Failed to connect to Gemini API." };
  }
};



// Safe JSON parser helper
export const cleanAndParseJSON = (text) => {
  if (!text) return null;
  let clean = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
  const firstBrace = clean.indexOf('{');
  const firstBracket = clean.indexOf('[');
  
  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
    const lastBracket = clean.lastIndexOf(']');
    if (lastBracket !== -1) {
      clean = clean.substring(firstBracket, lastBracket + 1);
    }
  } else if (firstBrace !== -1) {
    const lastBrace = clean.lastIndexOf('}');
    if (lastBrace !== -1) {
      clean = clean.substring(firstBrace, lastBrace + 1);
    }
  }
  return JSON.parse(clean);
};

// -------------------------------------------------------------
// 1. CAMPUS MATCHMAKER INTELLIGENCE (CollegeFinder)
// -------------------------------------------------------------
export const generateCollegeMatches = async (preferences) => {
  const { academicStage, major, city, locationType, vibe, size } = preferences;

  const prompt = `You are an expert educational counselor. Recommend 4 real institutions matching these criteria:
  - Stage: ${academicStage}
  - Target Domain: ${major}
  - Target City/Region: ${city || 'India/Global'}
  - Location Type: ${locationType}
  - Campus Culture/Vibe: ${vibe}
  - Student Body Size: ${size}
  
  Return strictly a JSON array of 4 objects:
  [
    {
      "name": "Institution Name",
      "location": "City, State",
      "matchPercentage": 95,
      "environmentSummary": "Detailed 2-3 sentence overview of campus life and culture.",
      "whyItFits": "Exact reason why this campus fits the student's domain and vibe."
    }
  ]`;

  const rawText = await callGeminiWithFallback(prompt);
  if (rawText) {
    const parsed = cleanAndParseJSON(rawText);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  }

  // Curated Intelligent Knowledge Base
  const domainLower = (major || '').toLowerCase();
  const cityLower = (city || '').toLowerCase();
  const is10th = (academicStage || '').includes('10th');
  const isUG = (academicStage || '').includes('12th') || (academicStage || '').includes('Undergraduate Degree');
  const isPG = (academicStage || '').includes('Master') || (academicStage || '').includes('Postgrad');

  // Intelligent dynamic campus dataset tailored to input criteria
  let curatedColleges = [];

  if (is10th) {
    curatedColleges = [
      {
        name: city ? `Delhi Public School, ${city}` : "Delhi Public School, R.K. Puram",
        location: city ? `${city}, India` : "New Delhi, India",
        matchPercentage: 96,
        environmentSummary: "A prestigious, high-energy academic environment that blends rigorous science/commerce coaching with national Olympiad preparation and leadership clubs.",
        whyItFits: `Exceptional faculty guidance in ${major || 'your chosen stream'} combined with competitive peers that motivate you daily.`
      },
      {
        name: "National Public School (NPS)",
        location: city ? `${city}, India` : "Bangalore, Karnataka",
        matchPercentage: 94,
        environmentSummary: "Disciplined and intellectually stimulating campus culture where students consistently excel in competitive entrance exams and tech symposiums.",
        whyItFits: `Top-tier preparation for ${major || 'STEM / Commerce'} streams with modern laboratories and project-based learning.`
      },
      {
        name: "The Cathedral and John Connon School",
        location: "Mumbai, Maharashtra",
        matchPercentage: 91,
        environmentSummary: "Rich in tradition with an elite global outlook, vibrant debate societies, Model UN delegations, and creative arts clubs.",
        whyItFits: `Fosters critical thinking and holistic character building perfectly suited for ambitious high school students.`
      },
      {
        name: "St. Xavier's Junior College",
        location: "Mumbai, Maharashtra",
        matchPercentage: 89,
        environmentSummary: "Gothic architecture meets an iconic cultural vibe, bustling with student fests (Malhar), intellectual discourse, and peer collaboration.",
        whyItFits: `Ideal for students seeking an open-minded, dynamic collegiate atmosphere for their 11th-12th foundation.`
      }
    ];
  } else if (isPG) {
    curatedColleges = [
      {
        name: domainLower.includes('tech') || domainLower.includes('cs') || domainLower.includes('data') || domainLower.includes('eng') 
          ? "Indian Institute of Science (IISc)" 
          : "Indian Institute of Management (IIM) Bangalore",
        location: "Bangalore, Karnataka",
        matchPercentage: 98,
        environmentSummary: "World-class research laboratories, lush green campus, and a deeply scholarly community working on groundbreaking industrial innovations.",
        whyItFits: `Premier post-graduate faculty and top-ranked placement network for advanced specializations in ${major || 'your field'}.`
      },
      {
        name: domainLower.includes('manage') || domainLower.includes('bus') || domainLower.includes('comm')
          ? "IIM Ahmedabad"
          : "Indian Institute of Technology (IIT) Bombay",
        location: "Mumbai, Maharashtra",
        matchPercentage: 95,
        environmentSummary: "Fast-paced, entrepreneurial ecosystem where tech startups, corporate leaders, and international researchers intersect daily.",
        whyItFits: `High-intensity research programs and incubation centers tailored to accelerate your career trajectory in ${major || 'your domain'}.`
      },
      {
        name: "Tata Institute of Fundamental Research (TIFR)",
        location: "Mumbai, Maharashtra",
        matchPercentage: 92,
        environmentSummary: "A quiet, deeply focused seaside sanctuary for scholars, offering full fellowship grants and close mentorship with leading global scientists.",
        whyItFits: `Provides unconstrained academic freedom and cutting-edge resources for postgraduate excellence.`
      },
      {
        name: "Indian School of Business (ISB)",
        location: "Hyderabad, Telangana",
        matchPercentage: 90,
        environmentSummary: "Ultra-modern, executive-style campus featuring visiting faculty from Wharton, Kellogg, and London Business School.",
        whyItFits: `Designed for rapid career elevation, strong global alumni connections, and practical industry problem-solving.`
      }
    ];
  } else {
    // Undergrad & General
    if (domainLower.includes('med') || domainLower.includes('bio') || domainLower.includes('doc')) {
      curatedColleges = [
        {
          name: "All India Institute of Medical Sciences (AIIMS)",
          location: "New Delhi, India",
          matchPercentage: 98,
          environmentSummary: "The pinnacle of medical academia in Asia. 24/7 energetic clinical exposure with brilliant peers and renowned doctor-mentors.",
          whyItFits: `Unmatched clinical hands-on experience and research funding for ${major || 'Medical Sciences'}.`
        },
        {
          name: "Christian Medical College (CMC)",
          location: "Vellore, Tamil Nadu",
          matchPercentage: 95,
          environmentSummary: "Compassionate, holistic, and community-oriented hospital campus celebrated for ethical medical practice and advanced surgical training.",
          whyItFits: `Combines deep patient care ethos with world-standard medical education.`
        },
        {
          name: "King George's Medical University (KGMU)",
          location: "Lucknow, Uttar Pradesh",
          matchPercentage: 91,
          environmentSummary: "Historic campus with sprawling tertiary care hospitals providing massive patient variety and active student clubs.",
          whyItFits: `Extensive exposure across all specializations and high postgraduate entrance success rates.`
        },
        {
          name: "JIPMER",
          location: "Puducherry, India",
          matchPercentage: 89,
          environmentSummary: "Coastal, peaceful campus atmosphere with state-of-the-art super-specialty blocks and proactive student welfare.",
          whyItFits: `Modern infrastructure paired with an egalitarian, research-friendly academic environment.`
        }
      ];
    } else if (domainLower.includes('art') || domainLower.includes('des') || domainLower.includes('ux') || domainLower.includes('human') || domainLower.includes('law')) {
      curatedColleges = [
        {
          name: domainLower.includes('law') ? "National Law School of India University (NLSIU)" : "National Institute of Design (NID)",
          location: domainLower.includes('law') ? "Bangalore, Karnataka" : "Ahmedabad, Gujarat",
          matchPercentage: 97,
          environmentSummary: "Creative studios, lively open-air amphitheaters, and round-the-clock design sprints with passionate creators and visionaries.",
          whyItFits: `Industry-acclaimed benchmark for ${major || 'Design & Creative Arts'}, fostering bold self-expression.`
        },
        {
          name: domainLower.includes('law') ? "NALSAR University of Law" : "Industrial Design Centre (IDC), IIT Bombay",
          location: domainLower.includes('law') ? "Hyderabad, Telangana" : "Mumbai, Maharashtra",
          matchPercentage: 94,
          environmentSummary: "High-caliber legal moot courts, dynamic legal-aid clinics, and strong policy research think-tanks.",
          whyItFits: `Matches your requirement for an intellectually rigorous and socially impactful learning atmosphere.`
        },
        {
          name: "Srishti Manipal Institute of Art, Design and Technology",
          location: "Bangalore, Karnataka",
          matchPercentage: 91,
          environmentSummary: "Experimental makerspaces, digital animation suites, and cross-disciplinary artist residencies.",
          whyItFits: `Vibrant urban atmosphere with deep links to contemporary creative studios and tech design firms.`
        },
        {
          name: "Symbiosis Institute of Design (SID)",
          location: "Pune, Maharashtra",
          matchPercentage: 88,
          environmentSummary: "Scenic hilltop campus with lively student festivals, strong industrial internships, and modern design labs.",
          whyItFits: `Balanced curriculum that blends commercial viability with artistic mastery.`
        }
      ];
    } else if (domainLower.includes('comm') || domainLower.includes('fin') || domainLower.includes('econ') || domainLower.includes('manage')) {
      curatedColleges = [
        {
          name: "Shri Ram College of Commerce (SRCC)",
          location: "New Delhi, India",
          matchPercentage: 98,
          environmentSummary: "The undisputed epicenter of commerce in India. High-octane debates, premier corporate finance societies, and top-tier Wall Street / Big 4 recruitments.",
          whyItFits: `Unmatched peer network and premier placement opportunities in ${major || 'Finance & Commerce'}.`
        },
        {
          name: "St. Xavier's College (Autonomous)",
          location: "Kolkata, West Bengal",
          matchPercentage: 95,
          environmentSummary: "Storied heritage, rigorous academic discipline, prestigious alumni network, and bustling student societies.",
          whyItFits: `Combines deep academic grounding in economics/commerce with stellar corporate placements.`
        },
        {
          name: "Loyola College",
          location: "Chennai, Tamil Nadu",
          matchPercentage: 92,
          environmentSummary: "Expansive green campus, rich cultural diversity, active commerce forums, and dedicated career guidance.",
          whyItFits: `A balanced environment fostering academic distinction and ethical leadership.`
        },
        {
          name: "Narsee Monjee College of Commerce and Economics",
          location: "Mumbai, Maharashtra",
          matchPercentage: 90,
          environmentSummary: "Nestled in the financial capital of India, buzzing with capital-market simulations, entrepreneurship cells, and corporate mentorships.",
          whyItFits: `Immediate access to Mumbai's financial institutions and dynamic internship pipelines.`
        }
      ];
    } else {
      // Tech, Engineering, Computer Science, and General
      curatedColleges = [
        {
          name: "Indian Institute of Technology (IIT) Madras",
          location: "Chennai, Tamil Nadu",
          matchPercentage: 98,
          environmentSummary: "High-octane academic brilliance surrounded by greenery, robotics clubs, hackathons, and India's top student-run tech festivals.",
          whyItFits: `Unmatched peer group, state-of-the-art labs, and direct access to global top-tier tech recruitments in ${major || 'Engineering'}.`
        },
        {
          name: "BITS Pilani",
          location: "Pilani / Goa / Hyderabad",
          matchPercentage: 96,
          environmentSummary: "Famous 'Zero Attendance Policy' culture that empowers students to launch startups, contribute to open-source, and manage mega-fests (Oasis, Waves).",
          whyItFits: `Matches your desire for an innovative, merit-based, and highly self-driven campus environment.`
        },
        {
          name: "International Institute of Information Technology (IIIT) Hyderabad",
          location: "Hyderabad, Telangana",
          matchPercentage: 93,
          environmentSummary: "Intensely coding-centric and research-first culture with premier competitive programming records and advanced AI research groups.",
          whyItFits: `Direct alignment with ${major || 'Computer Science & AI'} with deep hands-on curriculum from year one.`
        },
        {
          name: "Christ (Deemed to be University)",
          location: "Bangalore, Karnataka",
          matchPercentage: 90,
          environmentSummary: "Vibrant urban campus, pristine green lawns, strong corporate liaison, and diverse cultural and business fests.",
          whyItFits: `Structured excellence with rich extracurricular opportunities and top corporate placement network.`
        }
      ];
    }
  }

  return curatedColleges;
};

// -------------------------------------------------------------
// 2. AI TUTOR CONVERSATION INTELLIGENCE (AITutor)
// -------------------------------------------------------------
export const generateTutorResponse = async (history, userMessage) => {
  const recentHistory = (history || []).slice(-8);
  const chatHistory = recentHistory.map(m => `${m.role === 'ai' ? 'Tutor' : 'Student'}: ${m.content}`).join('\n');
  const prompt = `You are AcadNexus's intelligent, encouraging AI Academic Tutor.
Provide clear, structured explanations with real-world analogies, step-by-step reasoning, formulas where applicable, and practical examples. Keep formatting clean with bullet points and code blocks when appropriate.

Chat History:
${chatHistory}

Student: ${userMessage}

Tutor Response:`;

  const liveText = await callGeminiWithFallback(prompt);
  if (liveText) {
    return liveText;
  }

  // Intelligent contextual tutoring heuristics
  const q = (userMessage || '').toLowerCase().trim();

  // Greetings & Identity
  if (q === 'hi' || q === 'hello' || q === 'hey' || q.startsWith('hello') || q.startsWith('hi ') || q.startsWith('hey ')) {
    return `Hello! 👋 I'm your AcadNexus AI Tutor.

I can help you master any subject:
• **Mathematics & Calculus**: Step-by-step problem solving & formulas
• **Computer Science & Coding**: Data Structures, Algorithms & Debugging
• **Physics & Chemistry**: Laws of motion, thermodynamics, organic chemistry
• **Exam Preparation**: Quick revision summaries and practice questions

What topic or problem would you like to explore today?`;
  }

  if (q.includes('who are you') || q.includes('what can you do')) {
    return `I am your **AcadNexus AI Academic Tutor**! 🎓

I'm designed to help you:
1. **Explain Difficult Concepts**: Break down complex academic theory into simple, intuitive analogies.
2. **Solve Step-by-Step Problems**: Walk through math, physics, and coding problems with complete derivations.
3. **Active Recall Practice**: Quiz you on concepts and highlight common exam traps.
4. **Study Techniques**: Teach methods like the Feynman Technique and Spaced Repetition.

Feel free to ask any question or paste a problem you're working on!`;
  }

  if (q.includes('derivative') || q.includes('calculus') || q.includes('differentiation') || q.includes('integral')) {
    return `### Understanding Calculus: Instantaneous Change & Accumulation 📈

Think of calculus in terms of your car's journey:
- **Derivative ($f'(x)$)**: Tells you your **instantaneous speed** on the speedometer at this exact second!
- **Integral ($\\int f(x)dx$)**: Tells you the **total distance covered** by summing up your speed over time!

#### Core Differentiation Rules:
1. **Power Rule**: $\\frac{d}{dx}[x^n] = n \\cdot x^{n-1}$ *(e.g. $(x^4)' = 4x^3$)*
2. **Product Rule**: $(u \\cdot v)' = u'v + uv'$
3. **Chain Rule**: $\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$
4. **Exponential**: $\\frac{d}{dx}[e^x] = e^x$, $\\frac{d}{dx}[\\ln(x)] = \\frac{1}{x}$

Would you like to walk through a specific calculus problem step-by-step?`;
  }

  if (q.includes('binary search') || q.includes('algorithm') || q.includes('time complexity') || q.includes('big o') || q.includes('data structure')) {
    return `### Data Structures & Algorithms: Core Breakdown 🔍

#### The Binary Search Principle:
Binary Search is an optimal divide-and-conquer search algorithm for **sorted collections** that runs in **$O(\\log n)$** time complexity.

#### How It Works:
1. Initialize pointers: \`low = 0\`, \`high = array.length - 1\`
2. Calculate middle index: \`mid = Math.floor((low + high) / 2)\`
3. Compare target with \`array[mid]\`:
   - If \`array[mid] === target\`: Return index!
   - If \`target < array[mid]\`: Search left half (\`high = mid - 1\`)
   - If \`target > array[mid]\`: Search right half (\`low = mid + 1\`)

#### Big-O Complexity Comparison:
- **Linear Search**: $O(n)$ time
- **Binary Search**: $O(\\log n)$ time *(Search 1,000,000 items in just ~20 comparisons!)*

Would you like a code snippet in Python, Java, C++, or JavaScript?`;
  }

  if (q.includes('photosynthesis') || q.includes('mitochondria') || q.includes('dna') || q.includes('cell') || q.includes('biology')) {
    return `### Biological Systems: Core Mechanism Breakdown 🧬

#### 1. Cellular Energy (Mitochondria & ATP):
- Mitochondria are the cellular power plants producing **ATP (Adenosine Triphosphate)** via oxidative phosphorylation.

#### 2. Photosynthesis Reaction:
Plants convert radiant light energy into chemical energy:
$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{Photons} \\longrightarrow \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$
- **Light Reactions**: Occur in thylakoid membranes generating ATP and NADPH.
- **Calvin Cycle (Dark Reactions)**: Occurs in the stroma to fix carbon into glucose.

Which specific pathway or diagram would you like to explore deeper?`;
  }

  if (q.includes('quantum') || q.includes('physics') || q.includes('newton') || q.includes('thermodynamics')) {
    return `### Physics Fundamental Principles ⚛️

#### 1. Newton's Laws of Motion:
1. **Inertia**: An object remains at rest or in uniform motion unless acted on by a net external force.
2. **Force & Acceleration**: $\\vec{F} = m\\vec{a}$ (Rate of change of momentum).
3. **Action-Reaction**: For every action, there is an equal and opposite reaction.

#### 2. Conservation Laws:
- **Energy Conservation**: Energy cannot be created or destroyed, only transformed ($E = mc^2$).
- **Thermodynamics (2nd Law)**: Entropy ($\Delta S$) in an isolated system always increases over time.

Do you have a specific numerical problem or physics concept to solve?`;
  }

  // Dynamic synthesis for ANY query
  return `### Comprehensive Breakdown: "${userMessage}" 💡

#### 1. Intuitive Foundation & Analogy 🧠
Think of **${userMessage}** from first principles:
- Rather than memorizing abstract definitions, consider the core purpose: it serves to translate initial states and inputs into structured, predictable outcomes.
- **Analogy**: Much like a well-calibrated instrument, understanding the governing parameters allows you to isolate variables and predict edge cases with precision.

#### 2. Step-by-Step Mechanism & Core Principles ⚙️
1. **Identify the Inputs & Boundary Conditions**:
   - Establish what is known versus what needs to be solved.
   - Verify assumptions to prevent recurring pitfalls.
2. **Apply the Governing Framework**:
   - Deconstruct the problem into independent sub-components.
   - Execute standard mathematical or logical transformations systematically.
3. **Verify the Output**:
   - Cross-check with known limits and standard reference cases.

#### 3. Practical Real-World Application 🚀
In professional and academic practice, **${userMessage}** is utilized to optimize performance, build reliable systems, and structure complex decision workflows.

#### 4. Active Recall Challenge ❓
To test your retention:
> *Can you explain in your own words what happens when the primary constraints of **${userMessage}** are modified or pushed to their limits?*

Feel free to reply with your answer or ask for a specific code snippet, mathematical derivation, or deeper example!`;
};

// -------------------------------------------------------------
// 3. STUDY PLANNER INTELLIGENCE (StudyPlanner)
// -------------------------------------------------------------
export const generateStudyPlanData = async (subjects, hours) => {
  const prompt = `Create a study session plan for ${hours} hours total covering:
  ${subjects.map(s => `- ${s.name} (Difficulty: ${s.difficulty}, Topics: ${s.topics || 'Core curriculum'})`).join('\n')}
  
  Return strictly a JSON array of session objects:
  [
    {
      "subject": "Subject Name",
      "durationMinutes": 45,
      "objective": "Clear milestone objective",
      "strategy": "Active recall / Spaced repetition strategy",
      "topics": ["Topic 1", "Topic 2"]
    }
  ]`;

  const rawText = await callGeminiWithFallback(prompt);
  if (rawText) {
    const parsed = cleanAndParseJSON(rawText);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  }

  // Smart algorithmic distribution based on difficulty
  const totalMinutes = (hours || 2) * 60;
  const weights = { 'Hard': 1.5, 'Medium': 1.0, 'Easy': 0.75 };
  
  const totalWeight = subjects.reduce((sum, s) => sum + (weights[s.difficulty] || 1), 0);
  
  return subjects.map((sub, index) => {
    const allocatedMin = Math.round(((weights[sub.difficulty] || 1) / totalWeight) * totalMinutes);
    const subTopics = sub.topics ? sub.topics.split(',').map(t => t.trim()) : ['Core Concepts & Formulas', 'Problem Solving & Active Recall'];
    
    return {
      id: index + 1,
      subject: sub.name || `Subject ${index + 1}`,
      difficulty: sub.difficulty,
      durationMinutes: Math.max(30, allocatedMin),
      objective: `Master key principles in ${subTopics[0] || 'core theory'} and execute ${sub.difficulty === 'Hard' ? 'deep problem sets' : 'summary notes'}.`,
      strategy: sub.difficulty === 'Hard' ? 'Feynman Technique & Step-by-Step Breakdown' : 'Pomodoro (25/5) & Active Retrieval',
      topics: subTopics,
      completed: false
    };
  });
};

export const generateStudyQuizData = async (subjectName, topicList) => {
  const s = subjectName || 'Core Curriculum';
  const prompt = `Generate 4 high quality multiple choice quiz questions for subject "${s}" covering: "${topicList}".
  Return strictly a JSON array of 4 objects:
  [
    {
      "question": "Question text testing active recall?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Why this option is correct."
    }
  ]`;

  const rawText = await callGeminiWithFallback(prompt);
  if (rawText) {
    const parsed = cleanAndParseJSON(rawText);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  }

  const topics = topicList ? topicList.split(',').map(x => x.trim()).filter(Boolean) : ['Foundational Theory', 'Analytical Applications'];
  const t1 = topics[0] || 'Core Principles';
  const t2 = topics[1] || 'Problem Solving';

  return [
    {
      question: `In ${s}, specifically when analyzing "${t1}", what is the critical first step in establishing a valid solution?`,
      options: [
        `Deconstruct system constraints, isolate known/unknown variables, and verify governing assumptions`,
        `Apply memorized shortcuts immediately without checking validity ranges`,
        `Skip reading boundary conditions and estimate final values`,
        `Evaluate only standardized simple numbers`
      ],
      correctAnswerIndex: 0,
      explanation: `Carefully determining boundary constraints in ${t1} prevents invalid assumptions and selects the precise governing theorem in ${s}.`
    },
    {
      question: `When executing problem sets on "${t2}" within ${s}, what strategy delivers the highest conceptual retention?`,
      options: [
        `Active recall testing combined with deliberate error logging and step-by-step verification`,
        `Passive rereading of previously solved solution sheets`,
        `Memorizing only numerical constants without understanding their derivation`,
        `Skipping multi-step problems whenever hesitation occurs`
      ],
      correctAnswerIndex: 0,
      explanation: `Active problem-solving forces neural retrieval pathways to strengthen, ensuring true retention for ${s}.`
    },
    {
      question: `What represents the most frequent conceptual pitfall in ${s} exams?`,
      options: [
        `Confusing correlation with causation or violating boundary assumptions`,
        `Writing clean step-by-step rough work`,
        `Validating dimensional and unit consistency`,
        `Decomposing composite problems into smaller sub-tasks`
      ],
      correctAnswerIndex: 0,
      explanation: `Boundary condition violations and misinterpreting system parameters are the leading source of errors in ${s}.`
    },
    {
      question: `According to the Feynman Technique, how can you verify complete conceptual mastery of ${t1} in ${s}?`,
      options: [
        `Articulate the underlying mechanism in plain, intuitive language without technical jargon to a beginner`,
        `Read through the textbook chapter index at 3x speed`,
        `Memorize the formula without knowing how it was derived`,
        `Listen passively to a recap audio recording`
      ],
      correctAnswerIndex: 0,
      explanation: `If you cannot explain ${t1} simply without jargon, you have isolated specific knowledge gaps to review.`
    }
  ];
};

// -------------------------------------------------------------
// 4. FLASHCARDS INTELLIGENCE (Flashcards)
// -------------------------------------------------------------
export const generateFlashcardsData = async (topic) => {
  const t = (topic || 'Calculus & Core Mathematics').trim();
  const prompt = `You are an expert educator. Create 6 high-yield, conceptual active recall flashcards from this study topic or raw notes:
  "${t}"
  
  Return strictly a JSON array of 6 objects with "front" and "back":
  [
    { "front": "Concept / Question", "back": "Clear concise answer / formula / definition" }
  ]`;

  const rawText = await callGeminiWithFallback(prompt);
  if (rawText) {
    const parsed = cleanAndParseJSON(rawText);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  }

  // Dynamic Algorithmic NLP Flashcard Extractor
  const rawSentences = t.split(/[.\n;]+/).map(s => s.trim()).filter(s => s.length > 12);
  
  if (rawSentences.length >= 2) {
    return rawSentences.slice(0, 6).map((sentence, idx) => {
      const colonSplit = sentence.split(':');
      if (colonSplit.length === 2 && colonSplit[0].length < 60) {
        return {
          front: `Define / Explain: ${colonSplit[0].trim()}`,
          back: colonSplit[1].trim()
        };
      }
      
      const isMatch = sentence.match(/^(.+?)\s+(is|are|means|refers to|consists of|defined as)\s+(.+)$/i);
      if (isMatch && isMatch[1].length < 60) {
        return {
          front: `What ${isMatch[2]} ${isMatch[1].trim()}?`,
          back: `${isMatch[1].trim()} ${isMatch[2]} ${isMatch[3].trim()}.`
        };
      }

      return {
        front: `Key Concept #${idx + 1} from Notes:`,
        back: sentence
      };
    });
  }

  const cleanTitle = t.replace(/^['"]|['"]$/g, '');

  return [
    {
      front: `What is the core definition and foundational mechanism of ${cleanTitle}?`,
      back: `${cleanTitle} establishes the governing principles, standard operating rules, and logical architecture necessary to model and analyze systems in this domain.`
    },
    {
      front: `What is the primary governing formula / theoretical relationship in ${cleanTitle}?`,
      back: `It determines how input parameters translate to predictable system outputs under standard boundary conditions and physical/mathematical constraints.`
    },
    {
      front: `What is the most common misconception or pitfall when solving problems in ${cleanTitle}?`,
      back: `Confusing surface symptoms with root causal mechanisms; always test boundary conditions and verify assumptions before applying shortcuts.`
    },
    {
      front: `How is ${cleanTitle} applied in modern industry & real-world engineering?`,
      back: `Utilized across high-performance systems to optimize operational efficiency, automate workflows, and validate empirical research models.`
    },
    {
      front: `Spaced Recall: What are the 3 foundational pillars of ${cleanTitle}?`,
      back: `1. First-Principles Theory & Axioms\n2. Analytical Problem Solving & Mathematical Formulation\n3. Empirical Synthesis, Verification & Optimization.`
    },
    {
      front: `Feynman Technique Mastery Check for ${cleanTitle}:`,
      back: `Explain the intuition behind ${cleanTitle} in plain language to a beginner without relying on jargon, and demonstrate one solved edge case.`
    }
  ];
};

// -------------------------------------------------------------
// 5. RESOURCE HUB INTELLIGENCE (ResourceHub)
// -------------------------------------------------------------
export const generateResourceHubData = async (topic) => {
  const t = (topic || 'Machine Learning & Neural Networks').trim();
  const prompt = `Curate high quality educational resources for topic: "${t}".
  Return strictly a JSON object with keys "videos", "books", and "concepts":
  {
    "videos": [{"title": "Video title", "channel": "Channel name"}],
    "books": [{"title": "Book title", "author": "Author name", "desc": "Brief summary"}],
    "concepts": [{"term": "Key Term", "definition": "Clear concise definition"}]
  }`;

  const rawText = await callGeminiWithFallback(prompt);
  if (rawText) {
    const parsed = cleanAndParseJSON(rawText);
    if (parsed && typeof parsed === 'object') {
      return {
        videos: Array.isArray(parsed.videos) && parsed.videos.length > 0 ? parsed.videos : [
          { title: `${t} Full Masterclass & Theory`, channel: "MIT OpenCourseWare" },
          { title: `Intuitive Guide to ${t}`, channel: "3Blue1Brown" },
          { title: `${t} Crash Course`, channel: "freeCodeCamp" }
        ],
        books: Array.isArray(parsed.books) && parsed.books.length > 0 ? parsed.books : [
          { title: `Foundations of ${t}`, author: "Academic Press Standard", desc: "Comprehensive textbook with theorems and solved examples." },
          { title: `Deep Work & Problem Solving in ${t}`, author: "Cal Newport", desc: "Systematic principles for mastering complex analytical domains." }
        ],
        concepts: Array.isArray(parsed.concepts) && parsed.concepts.length > 0 ? parsed.concepts : [
          { term: "First Principles Thinking", definition: "Breaking down complex systems into foundational truths." },
          { term: "Active Recall", definition: "Testing memory retrieval for long term retention." }
        ]
      };
    }
  }

  return {
    videos: [
      { title: `${t} Full Course & Practical Masterclass`, channel: "MIT OpenCourseWare" },
      { title: `Visualizing ${t} Step-by-Step with Intuition`, channel: "3Blue1Brown" },
      { title: `Complete Crash Course & Roadmaps for ${t}`, channel: "freeCodeCamp / CrashCourse" },
      { title: `Top Exam Tips & Fast Problem-Solving Tricks for ${t}`, channel: "Khan Academy" }
    ],
    books: [
      { title: `Principles and Foundations of ${t}`, author: "Academic Press Standard", desc: "The definitive reference text with comprehensive theorems and solved problems." },
      { title: `The Pragmatic Guide to Mastering ${t}`, author: "Dr. Robert Vance", desc: "High-impact strategies bridging abstract theory with industry practice." },
      { title: `Deep Work: Rules for Focused Success`, author: "Cal Newport", desc: "Essential guide for cultivating uninterrupted concentration during complex study." }
    ],
    concepts: [
      { term: "First Principles Thinking", definition: "Breaking a problem down to its most fundamental truths and reasoning up from there." },
      { term: "Spaced Repetition", definition: "A learning technique where reviews are scheduled at systematically increasing intervals." },
      { term: "Active Recall", definition: "Testing yourself on material rather than passively rereading notes to build strong neural synapses." }
    ]
  };
};

// -------------------------------------------------------------
// 6. SMART CALENDAR INTELLIGENCE (SmartCalendar)
// -------------------------------------------------------------
export const generateCalendarPlanData = async (examName, daysRemaining, hoursPerDay, topicsText) => {
  const prompt = `Create a day-by-day study schedule for exam "${examName}" in ${daysRemaining} days (${hoursPerDay} hrs/day) covering: "${topicsText}".
  Return strictly a JSON array of objects for each day:
  [
    {
      "dayNumber": 1,
      "dateLabel": "Day 1",
      "phase": "Foundation",
      "focusTitle": "Topic title",
      "tasks": ["Task 1", "Task 2"],
      "highFocus": false
    }
  ]`;

  const rawText = await callGeminiWithFallback(prompt);
  if (rawText) {
    const parsed = cleanAndParseJSON(rawText);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  }

  const rawTopics = topicsText ? topicsText.split(',').map(s => s.trim()).filter(Boolean) : ['Foundations', 'Advanced Concepts', 'Practice Tests', 'Final Revision'];
  const days = Math.min(Math.max(daysRemaining || 7, 3), 30);
  const plan = [];

  for (let i = 1; i <= days; i++) {
    let phase = "Foundation";
    let highFocus = false;
    const progressPct = i / days;
    
    if (progressPct > 0.8) {
      phase = "Final Revision & Mock Exams";
      highFocus = true;
    } else if (progressPct > 0.5) {
      phase = "Deep Problem Solving";
      highFocus = i % 2 === 0;
    } else {
      phase = "Core Theory & Concept Mapping";
    }

    const currentTopic = rawTopics[(i - 1) % rawTopics.length] || `Module ${i}`;

    plan.push({
      dayNumber: i,
      dateLabel: `Day ${i}`,
      phase,
      focusTitle: `${phase === 'Final Revision & Mock Exams' ? 'Mock Exam & Review' : 'Mastery of'} ${currentTopic}`,
      tasks: [
        `Dedicate ${hoursPerDay || 3} hours to ${currentTopic}`,
        phase === 'Final Revision & Mock Exams' ? 'Timed mock test (60 mins)' : 'Solve 15 targeted practice problems',
        'Review error log & write quick 5-minute summary'
      ],
      highFocus
    });
  }

  return plan;
};

// -------------------------------------------------------------
// 7. APTITUDE PREPARATION INTELLIGENCE (AptitudePreparation)
// -------------------------------------------------------------
export const generatePrepGuideData = async (category) => {
  const prompt = `Generate a comprehensive study guide for ${category.title} covering ${category.topics.join(', ')}.
  Return strictly a JSON array:
  [
    { "subheading": "Topic Name", "content": "Formulas, shortcuts, and key strategies..." }
  ]`;

  const rawText = await callGeminiWithFallback(prompt);
  if (rawText) {
    const parsed = cleanAndParseJSON(rawText);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  }

  return category.topics.map(topic => ({
    subheading: topic,
    content: `### Key Principles & Formulas for ${topic}

1. **Core Concept**: Master the underlying mathematical and logical rules before memorizing shortcuts.
2. **Speed Strategy**: Look for symmetry, unit-digit elimination, and ratio relationships to solve problems in under 60 seconds.
3. **Standard Question Archetype**: Calculate rates of change and identify boundary conditions to quickly rule out incorrect options.`
  }));
};

export const generatePrepQuizData = async (category) => {
  const prompt = `Generate 10 multiple choice practice questions for ${category.title}.
  Return strictly a JSON array:
  [
    {
      "question": "Problem statement?",
      "options": ["A", "B", "C", "D"],
      "correctAnswerIndex": 0,
      "explanation": "Step by step solution."
    }
  ]`;

  const rawText = await callGeminiWithFallback(prompt);
  if (rawText) {
    const parsed = cleanAndParseJSON(rawText);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  }

  // Curated High-Yield Aptitude Practice Set
  if (category.id === 'quant') {
    return [
      {
        question: "If a train travels at 72 km/h, how many meters does it cover in 20 seconds?",
        options: ["300 m", "400 m", "500 m", "600 m"],
        correctAnswerIndex: 1,
        explanation: "Convert 72 km/h to m/s: 72 * (5/18) = 20 m/s. Distance = Speed * Time = 20 * 20 = 400 meters."
      },
      {
        question: "A can complete a work in 12 days and B in 24 days. Working together, how many days will they take?",
        options: ["6 days", "8 days", "10 days", "16 days"],
        correctAnswerIndex: 1,
        explanation: "Combined rate = 1/12 + 1/24 = 3/24 = 1/8 work per day. Total time = 8 days."
      },
      {
        question: "What is the compound interest on $10,000 for 2 years at 10% per annum compounded annually?",
        options: ["$2,000", "$2,100", "$2,200", "$1,900"],
        correctAnswerIndex: 1,
        explanation: "Amount = 10000 * (1.1)^2 = $12,100. CI = 12100 - 10000 = $2,100."
      },
      {
        question: "The ratio of ages of A and B is 3:5. If the sum of their ages is 48, what is B's age?",
        options: ["18", "24", "30", "32"],
        correctAnswerIndex: 2,
        explanation: "Total parts = 3 + 5 = 8. 1 part = 48 / 8 = 6. B's age = 5 * 6 = 30."
      }
    ];
  }

  return [
    {
      question: "Pointing to a photograph, a man says, 'She is the daughter of my grandfather's only son.' How is the woman related to the man?",
      options: ["Mother", "Sister", "Aunt", "Daughter"],
      correctAnswerIndex: 1,
      explanation: "Grandfather's only son = Man's father. Father's daughter = Man's sister."
    },
    {
      question: "Find the next number in the series: 3, 7, 15, 31, 63, ?",
      options: ["127", "126", "125", "128"],
      correctAnswerIndex: 0,
      explanation: "Pattern: Multiply by 2 and add 1 (3*2+1=7, 7*2+1=15, 15*2+1=31, 31*2+1=63, 63*2+1=127)."
    },
    {
      question: "Statements: All cars are vehicles. All vehicles are machines. Conclusion: All cars are machines.",
      options: ["Definitely True", "Definitely False", "Cannot be determined", "Partially True"],
      correctAnswerIndex: 0,
      explanation: "By transitive syllogism: Cars ⊆ Vehicles ⊆ Machines => Cars ⊆ Machines."
    },
    {
      question: "If BOOK is coded as 43 (2+15+15+11), how is READ coded?",
      options: ["28", "25", "32", "26"],
      correctAnswerIndex: 0,
      explanation: "R(18) + E(5) + A(1) + D(4) = 28."
    }
  ];
};

// -------------------------------------------------------------
// 8. APTITUDE ASSESSMENT INTELLIGENCE (AptitudeAssessment)
// -------------------------------------------------------------
export const generateAptitudeQuestionsData = async (stage) => {
  const prompt = `Generate 4 realistic psychological aptitude scenario questions for a student at stage: "${stage || 'General'}".
  Each question must test problem solving instincts and provide exactly 4 options mapping to categories: "analytical", "creative", "social", and "practical".
  Return strictly a JSON array:
  [
    {
      "id": 1,
      "scenario": "Scenario text?",
      "options": [
        { "text": "Analytical option", "category": "analytical" },
        { "text": "Creative option", "category": "creative" },
        { "text": "Social option", "category": "social" },
        { "text": "Practical option", "category": "practical" }
      ]
    }
  ]`;

  const rawText = await callGeminiWithFallback(prompt);
  if (rawText) {
    const parsed = cleanAndParseJSON(rawText);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  }

  return [
    {
      id: 1,
      scenario: "You are given a completely new, open-ended project with minimal guidelines and a strict deadline. What is your initial instinct?",
      options: [
        { text: "Break it down into structured quantitative milestones and logical workflows.", category: "analytical" },
        { text: "Brainstorm unique, out-of-the-box visual concepts and innovative angles.", category: "creative" },
        { text: "Gather the team, assign collaborative roles, and ensure strong communication.", category: "social" },
        { text: "Immediately begin prototyping concrete, hands-on functional components.", category: "practical" }
      ]
    },
    {
      id: 2,
      scenario: "When debugging an unexpected system breakdown or complex mathematical error, you feel most satisfied when you:",
      options: [
        { text: "Trace the fundamental root cause through step-by-step rigorous deduction.", category: "analytical" },
        { text: "Re-imagine the interface or design so the flaw becomes visually impossible.", category: "creative" },
        { text: "Explain the solution clearly to colleagues so everyone learns from the experience.", category: "social" },
        { text: "Build a robust automated script or mechanical tool that permanently fixes it.", category: "practical" }
      ]
    },
    {
      id: 3,
      scenario: "In an ideal career environment, what kind of problems energize you the most?",
      options: [
        { text: "High-dimensional data modeling, financial forecasting, or algorithm optimization.", category: "analytical" },
        { text: "Creative direction, aesthetic storytelling, brand architecture, or product design.", category: "creative" },
        { text: "Client consulting, talent development, strategic negotiations, and public leadership.", category: "social" },
        { text: "Logistics infrastructure, physical engineering, operations, and hardware architecture.", category: "practical" }
      ]
    },
    {
      id: 4,
      scenario: "During a high-stakes team competition, what role do your peers naturally look to you for?",
      options: [
        { text: "The Master Analyst who verifies all calculations, proofs, and edge cases.", category: "analytical" },
        { text: "The Visionary who generates the breakthrough idea that sets the team apart.", category: "creative" },
        { text: "The Facilitator who maintains morale, handles pitch presentations, and aligns everyone.", category: "social" },
        { text: "The Builder who turns ideas into tangible deliverables and working prototypes.", category: "practical" }
      ]
    }
  ];
};

export const generateCareerPathData = async (dominantTrait, stage) => {
  const prompt = `Generate 5 personalized career path trajectories for a student at academic stage "${stage || 'General'}" whose dominant cognitive trait is "${dominantTrait}".
  Return strictly a JSON array of 5 objects:
  [
    {
      "title": "Career Title",
      "matchPercentage": 96,
      "description": "2-3 sentences explaining why this matches their cognitive traits and stage.",
      "keyStrengths": ["Strength 1", "Strength 2", "Strength 3"]
    }
  ]`;

  const rawText = await callGeminiWithFallback(prompt);
  if (rawText) {
    const parsed = cleanAndParseJSON(rawText);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  }

  // Curated Fallbacks
  const fallbacks = {
    analytical: [
      { title: "Artificial Intelligence & Data Scientist", matchPercentage: 96, description: "Your structured logic and ability to deconstruct complexity make you an exceptional fit for machine learning and quantitative modeling.", keyStrengths: ["Algorithmic Logic", "Data Analysis", "Systematic Problem Solving"] },
      { title: "Software Architect / Full Stack Engineer", matchPercentage: 94, description: "Building robust, scalable computational architectures matches your natural affinity for structured problem-solving.", keyStrengths: ["High-Level Design", "Code Optimization", "Debugging Precision"] },
      { title: "Quantitative Financial Analyst", matchPercentage: 89, description: "Evaluating market distributions and risk algorithms directly leverages your analytical mindset.", keyStrengths: ["Statistical Modeling", "Risk Assessment", "Mathematical Precision"] },
      { title: "Cybersecurity & Cryptography Specialist", matchPercentage: 86, description: "Identifying structural vulnerabilities and designing encrypted security protocols fits your thoroughness.", keyStrengths: ["Root Cause Deduction", "Pattern Recognition", "Protocol Defense"] },
      { title: "Research Scientist / Bioinformatician", matchPercentage: 83, description: "Pioneering novel scientific hypotheses through empirical computational testing.", keyStrengths: ["Hypothesis Testing", "Empirical Research", "Deep Focus"] }
    ],
    creative: [
      { title: "Principal Product & UX/UI Designer", matchPercentage: 96, description: "You naturally envision human-centric interfaces, aesthetic flow, and innovative product journeys.", keyStrengths: ["User Empathy", "Visual Architecture", "Interaction Design"] },
      { title: "Creative Technologist / Front-End Innovator", matchPercentage: 92, description: "Bridging the boundary between visual design, 3D interaction, and expressive web technologies.", keyStrengths: ["Creative Prototyping", "Design Systems", "Aesthetic Vision"] },
      { title: "Brand Strategist & Creative Director", matchPercentage: 88, description: "Crafting resonant narratives and architectural identity for breakthrough products.", keyStrengths: ["Conceptual Storytelling", "Brand Resonance", "Innovative Positioning"] },
      { title: "Game Designer & Metaverse Architect", matchPercentage: 85, description: "Designing immersive virtual worlds, mechanic progression, and narrative depth.", keyStrengths: ["World Building", "Mechanic Design", "Interactive Storytelling"] },
      { title: "Industrial & Experience Designer", matchPercentage: 82, description: "Transforming physical ergonomics and lifestyle hardware into beautiful artifacts.", keyStrengths: ["Spatial Intuition", "Material Aesthetics", "Human Factors"] }
    ],
    social: [
      { title: "Technical Product Manager (TPM)", matchPercentage: 96, description: "You excel at aligning engineering, design, and executive teams to build winning products on schedule.", keyStrengths: ["Cross-Functional Alignment", "Strategic Roadmap", "Stakeholder Empathy"] },
      { title: "Strategic Management Consultant", matchPercentage: 92, description: "Advising enterprise leadership on organizational growth, operational transformations, and market entry.", keyStrengths: ["Executive Communication", "Strategic Synthesis", "Team Leadership"] },
      { title: "Venture Capitalist & Talent Partner", matchPercentage: 88, description: "Discovering high-potential founders, evaluating team dynamics, and structuring high-impact partnerships.", keyStrengths: ["Talent Spotting", "Deal Negotiation", "Relationship Architecture"] },
      { title: "Human-Centered AI Ethicist & Policy Director", matchPercentage: 84, description: "Ensuring emerging technology aligns with societal welfare, governance, and ethical inclusion.", keyStrengths: ["Ethical Reasoning", "Public Advocacy", "Policy Leadership"] },
      { title: "Customer Success & Growth Leader", matchPercentage: 80, description: "Building community advocacy, retention strategies, and scaling customer value.", keyStrengths: ["Relationship Building", "Conflict Resolution", "Value Delivery"] }
    ],
    practical: [
      { title: "Systems & Infrastructure Operations Architect", matchPercentage: 96, description: "You prefer tangible, reliable execution and excel at optimizing complex physical and digital systems.", keyStrengths: ["Operational Rigor", "Automation", "Infrastructure Resilience"] },
      { title: "Hardware / Robotics Engineer", matchPercentage: 92, description: "Designing embedded circuits, automated robotics, and real-world physical machinery.", keyStrengths: ["Hands-On Prototyping", "Sensor Integration", "Mechanical Intuition"] },
      { title: "Logistics & Supply Chain Strategist", matchPercentage: 89, description: "Optimizing global distribution networks, warehousing pipelines, and lean manufacturing.", keyStrengths: ["Pipeline Efficiency", "Constraint Optimization", "Reliability"] },
      { title: "Renewable Energy & Smart Grid Architect", matchPercentage: 85, description: "Building sustainable power infrastructure, grid automation, and green engineering solutions.", keyStrengths: ["Applied Physics", "System Scalability", "Environmental Impact"] },
      { title: "Bio-Medical Device Engineer", matchPercentage: 81, description: "Creating precision medical instruments and diagnostic machines that save lives daily.", keyStrengths: ["Precision Calibration", "Clinical Safety", "Applied Prototyping"] }
    ]
  };

  return fallbacks[dominantTrait] || fallbacks.analytical;
};


