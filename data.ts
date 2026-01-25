
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface PortfolioItem {
  id: string;
  type: 'research' | 'project';
  metadata: {
    title: string;
    subtitle: string;
    venue: string;
    date: string;
    link?: string;
    themeColor: string;
    secondaryColor: string;
  };
  narrative: {
    problem: string;
    innovation: string;
    impact: string;
  };
  visuals: {
    diagramType: 'bar-chart' | 'flow-chart' | 'fuzzy-curves' | 'venn-diagram' | 'waveform' | 'network-graph' | 'confidence-meter' | 'depth-grid';
  };
  technical?: {
    techStack: string[];
    codeSnippet: string;
  };
  authors: Array<{ name: string; role: string }>;
}

export const papers: PortfolioItem[] = [
  {
    id: 'autism-ai',
    type: 'research',
    metadata: {
      title: "Conversational AI for Supporting Children with Autism",
      subtitle: "A deep learning-based virtual agent for social and language skills development.",
      venue: "Book Chapter (Springer)",
      date: "July 2025",
      link: "https://link.springer.com/chapter/10.1007/978-981-96-7556-2_16",
      themeColor: "#20c997", // Soft Teal
      secondaryColor: "#e6fffa",
    },
    narrative: {
      problem: "Children with Autism Spectrum Disorder (ASD) often face significant barriers in social interaction and communication. They may find it difficult to interpret emotions, causing anxiety in social situations that hinders development.",
      innovation: "We propose a conversational virtual agent utilizing a multi-modal Deep Learning framework. It combines Speech Emotion Recognition (using CNNs) with Text Emotion Recognition (NLP) to create a responsive, empathetic digital companion.",
      impact: "The framework provides a safe, judgment-free environment for children to learn English grammar and socialization skills. It offers real-time feedback that adapts to the child's emotional state, bridging the gap between therapy and daily life."
    },
    visuals: {
      diagramType: 'flow-chart'
    },
    technical: {
      techStack: ["Python", "Keras", "Librosa", "NLTK"],
      codeSnippet: `def extract_features(data, sample_rate):
    # ZCR
    result = np.array([])
    zcr = np.mean(librosa.feature.zero_crossing_rate(y=data).T, axis=0)
    result = np.hstack((result, zcr))

    # Chroma_stft
    stft = np.abs(librosa.stft(data))
    chroma_stft = np.mean(librosa.feature.chroma_stft(S=stft, sr=sample_rate).T, axis=0)
    result = np.hstack((result, chroma_stft))

    # MFCC
    mfcc = np.mean(librosa.feature.mfcc(y=data, sr=sample_rate).T, axis=0)
    result = np.hstack((result, mfcc))
    
    return result`
    },
    authors: [
      { name: "Ishani Kathuria", role: "Amity University" },
      { name: "Kamad Saxena", role: "Amity University" },
      { name: "Archana Singh", role: "Amity University" }
    ]
  },
  {
    id: 'food-recommendation',
    type: 'research',
    metadata: {
      title: "Real-Time Temperature Based Food Recommendation",
      subtitle: "Dynamic menu personalization using Gradient Boosting and Fuzzy Logic.",
      venue: "ICCNT (IEEE)",
      date: "July 2023",
      link: "https://ieeexplore.ieee.org/document/10306446/",
      themeColor: "#FF9933", // Saffron Orange
      secondaryColor: "#fff7ed",
    },
    narrative: {
      problem: "Weather significantly influences human food cravings, yet modern food service menus remain static. This fails to capitalize on shifting preferences, leading to suboptimal customer experiences and missed sales opportunities.",
      innovation: "We developed a hybrid model combining a Multi-Output Gradient Boosting Regressor with Fuzzy Logic. We used Gaussian membership functions to categorize 'time of day' into fuzzy slots like 'morning' or 'late night' to contextually drive recommendations.",
      impact: "The model achieved a high coefficient of determination (R² of 0.917). We successfully deployed a web interface that recommends specific comfort foods (e.g., Gajar ka halwa in winter) based on real-time local temperature."
    },
    visuals: {
      diagramType: 'fuzzy-curves'
    },
    technical: {
      techStack: ["Scikit-Learn", "Fuzzy Logic", "OpenWeatherMap API", "Flask"],
      codeSnippet: `from skfuzzy import control as ctrl

# Antecedents & Consequent
temperature = ctrl.Antecedent(np.arange(-10, 50, 1), 'temp')
time_of_day = ctrl.Antecedent(np.arange(0, 24, 1), 'time')
recommendation = ctrl.Consequent(np.arange(0, 10, 1), 'rec')

# Membership Functions
temperature['cold'] = fuzz.trapmf(temperature.universe, [-10, -10, 10, 20])
temperature['hot'] = fuzz.trapmf(temperature.universe, [20, 30, 50, 50])

# Rules
rule1 = ctrl.Rule(temperature['cold'] & time_of_day['morning'], recommendation['warm_comfort'])
rule2 = ctrl.Rule(temperature['hot'] & time_of_day['afternoon'], recommendation['refreshing'])`
    },
    authors: [
      { name: "Ishani Kathuria", role: "Amity University" },
      { name: "Madhulika Bhatia", role: "Amity University" },
      { name: "Aniruddh Atrey", role: "Amity University" },
      { name: "S. Sujith", role: "Amity Institute of Food Technology" }
    ]
  },
  {
    id: 'healthcare-dl',
    type: 'research',
    metadata: {
      title: "Deep Learning in Healthcare: A Systematic Analysis",
      subtitle: "A review of DL architectures in Drug Discovery, Imaging, and EHR.",
      venue: "ICRIC (Springer)",
      date: "May 2023",
      link: "https://link.springer.com/chapter/10.1007/978-981-19-9876-8_29",
      themeColor: "#EF4444", // Medical Red
      secondaryColor: "#fef2f2",
    },
    narrative: {
      problem: "The healthcare industry is overwhelmed by massive amounts of unstructured data like images and clinical notes. Manual analysis is time-consuming, expensive (taking years for drug discovery), and prone to human error.",
      innovation: "We conducted a systematic review of 24 key research papers, categorizing the efficacy of CNNs, RNNs, and LSTMs across three critical domains: Drug Discovery, Medical Imaging, and Electronic Health Records (EHR).",
      impact: "The analysis concluded that CNNs and LSTMs are the dominant architectures. It highlights their specific success in automating diabetic retinopathy diagnosis and predicting patient readmission rates, paving the way for more efficient automated care."
    },
    visuals: {
      diagramType: 'venn-diagram'
    },
    technical: {
      techStack: ["Systematic Review", "Meta-Analysis", "Prisma Guidelines"],
      codeSnippet: `Key Findings:
1. CNNs (Convolutional Neural Networks):
   - Best for: Medical Imaging (X-Ray, MRI)
   - Accuracy: >95% in Diabetic Retinopathy detection
   
2. RNNs/LSTMs (Recurrent Neural Networks):
   - Best for: EHR & Time-series data
   - Use Case: Patient Readmission Prediction
   
3. GANs (Generative Adversarial Networks):
   - Emerging role in Drug Discovery (Molecule generation)`
    },
    authors: [
      { name: "Ishani Kathuria", role: "Amity University" },
      { name: "Madhulika Bhatia", role: "Amity University" },
      { name: "Anchal Garg", role: "University of Bolton" },
      { name: "Ashish Grover", role: "Manav Rachna Institute" }
    ]
  },
  {
    id: 'pm25-prediction',
    type: 'research',
    metadata: {
      title: "Predicting daily PM2.5 using Classic Azure ML Studio",
      subtitle: "A comparative analysis of neural networks and linear regression for air quality prediction.",
      venue: "COM-IT-CON (IEEE)",
      date: "May 2022",
      link: "https://ieeexplore.ieee.org/document/9850494",
      themeColor: "#007FFF", // Azure Blue
      secondaryColor: "#e0f2fe",
    },
    narrative: {
      problem: "Air pollution is a rising global threat, but ground supervising stations are limited in number, creating 'blind spots' in air quality data at unobserved locations. Remote detection tools are needed to bridge this gap.",
      innovation: "We utilized the Azure ML Studio platform to process satellite data (Aerosol Optical Thickness) and meteorological data. We rigorously compared six different feature selection methods to optimize inputs for both linear and neural network models.",
      impact: "The research demonstrated that a Neural Network Regression model, specifically when paired with a 'count-based' feature selection metric, significantly outperformed linear regression, achieving the lowest RMSE score of 0.508."
    },
    visuals: {
      diagramType: 'bar-chart'
    },
    technical: {
      techStack: ["Azure ML Studio", "Neural Network Regression", "Pearson Correlation"],
      codeSnippet: `Experiment Setup (Azure ML):

dataset = Dataset.get_by_name(workspace, name='PM25_Data')

# Feature Selection Step
filter_module = FilterBasedFeatureSelection(
    column_selection_mode="IndicesAndNames",
    selected_columns=selected_features, # ['AOT', 'Temp', 'Humidity']
    feature_scoring_method="CountBased"
)

# Model Training
nn_regressor = NeuralNetworkRegression(
    learning_rate=0.01,
    number_of_hidden_nodes=100,
    max_learning_iterations=1000
)`
    },
    authors: [
      { name: "Kamad Saxena", role: "Amity University" },
      { name: "Ishani Kathuria", role: "Amity University" },
      { name: "Madhulika Bhatia", role: "Amity University" },
      { name: "Anchal Garg", role: "University of Bolton" }
    ]
  },
];

export const projects: PortfolioItem[] = [
  {
    id: 'trustworthyrag',
    type: 'project',
    metadata: {
      title: "TrustworthyRAG",
      subtitle: "Query-Adaptive Learned Fusion (QALF) for optimal multimodal retrieval.",
      venue: "Project",
      date: "2024",
      themeColor: "#8b5cf6", // Violet
      secondaryColor: "#f5f3ff",
    },
    narrative: {
      problem: "Standard RAG systems struggle with complex reasoning queries, often retrieving irrelevant chunks. Fixed routing strategies fail to adapt to the nuance of user intent and query complexity.",
      innovation: "Designed QALF (Query-Adaptive Learned Fusion) to dynamically route queries to Vector, Graph, or Keyword modalities based on 4D complexity analysis. Integrated Neo4j with Llama 3 to link unstructured data into a unified multimodal knowledge graph.",
      impact: "Significantly outperformed standard RRF baselines by optimizing retrieval paths. enabled complex multi-hop retrieval across text, images, and tables, improving answer fidelity for high-complexity queries."
    },
    visuals: {
      diagramType: 'network-graph'
    },
    technical: {
      techStack: ["Neo4j", "LangChain", "Llama 3", "Python"],
      codeSnippet: `def qalf_routing(query, context):
    # 4D Complexity & Intent Analysis
    complexity = analyze_complexity(query) # 0.0 to 1.0
    intent = classify_intent(query)        # e.g., 'multi_hop', 'factual'

    # Dynamic Routing Logic
    if complexity > 0.8 or intent == 'multi_hop':
        # Prioritize Graph Traversal for reasoning
        return graph_retriever.query(query)
    elif intent == 'visual_lookup':
        # Route to Vector Store for image embeddings
        return multimodal_vector_store.similarity_search(query)
    else:
        # Fallback to Hybrid (Keyword + Dense)
        return hybrid_retriever.invoke(query)`
    },
    authors: [
      { name: "Ishani Kathuria", role: "Project Lead" }
    ]
  },
  {
    id: 'autoredteam',
    type: 'project',
    metadata: {
      title: "AutoRedTeam",
      subtitle: "Multi-agent adversarial simulation framework for LLM safety.",
      venue: "Project",
      date: "2024",
      themeColor: "#ef4444", // Red
      secondaryColor: "#fef2f2",
    },
    narrative: {
      problem: "Manual red-teaming of LLMs is unscalable and inconsistent. Ensuring safety against prompt injections and jailbreaks requires continuous, adaptive adversarial testing.",
      innovation: "Engineered a 3-agent feedback loop (Attacker, Target, Judge) where the 'Attacker' iteratively refines Chain-of-Thought jailbreak strategies based on the 'Target's' responses. Built a deterministic 'Judge' to score defense performance.",
      impact: "Enabled systematic stress-testing across Gemini 1.5 Pro, GPT-4, and Llama 3. The React/TypeScript frontend visualizes real-time thought processes, simulating enterprise-grade red-teaming workflows."
    },
    visuals: {
      diagramType: 'flow-chart'
    },
    technical: {
      techStack: ["React", "TypeScript", "LangChain", "Gemini/GPT-4"],
      codeSnippet: `const redTeamLoop = async (target: LLM, attack: string) => {
  // 1. Attack Execution
  const response = await target.generate(attack);
  
  // 2. Deterministic Judging
  const judgeScore = await judgeAgent.evaluate(response, safetyRubric);

  if (judgeScore.isUnsafe) {
    console.log("Jailbreak Successful:", attack);
    return { success: true, prompt: attack };
  }

  // 3. Iterative Refinement (CoT)
  const refinedAttack = await attackerAgent.refine({
    original: attack,
    targetResponse: response,
    critique: judgeScore.reasoning
  });
  
  return redTeamLoop(target, refinedAttack);
}`
    },
    authors: [
      { name: "Ishani Kathuria", role: "Project Lead" }
    ]
  },
  {
    id: 'deepfakeguard',
    type: 'project',
    metadata: {
      title: "DeepFakeGuard",
      subtitle: "Client-side Edge AI forensic tool for synthetic audio detection.",
      venue: "Project",
      date: "2024",
      themeColor: "#0ea5e9", // Sky Blue
      secondaryColor: "#f0f9ff",
    },
    narrative: {
      problem: "Deepfake audio is becoming indistinguishable from reality, posing risks to privacy and security. Server-side detection raises privacy concerns and introduces latency.",
      innovation: "Evolved from a FastAPI microservice to a fully client-side solution using Transformers.js. Implemented streaming inference logic to analyze spectrograms and waveforms directly in the browser without external dependencies.",
      impact: "Eliminated server-side processing, ensuring user privacy and sub-second latency. The forensic dashboard visualizes detection confidence in real-time, providing immediate feedback on audio authenticity."
    },
    visuals: {
      diagramType: 'waveform'
    },
    technical: {
      techStack: ["Transformers.js", "React", "Recharts", "Web Audio API"],
      codeSnippet: `import { pipeline } from '@xenova/transformers';

// Initialize Client-side Pipeline
const detector = await pipeline('audio-classification', 'xenova/audio-fake-detect', {
    quantized: true // Optimized for browser
});

async function processAudioStream(chunk: Float32Array) {
    // 1. Feature Extraction (Spectrogram/MFCC)
    const features = extractFeatures(chunk);
    
    // 2. Inference in Browser
    const result = await detector(features);
    
    // 3. Update Visualizer
    updateDashboard({
        timestamp: Date.now(),
        probability: result[0].score,
        isFake: result[0].label === 'FAKE'
    });
}`
    },
    authors: [
      { name: "Ishani Kathuria", role: "Project Lead" }
    ]
  },
  {
    id: 'autbot',
    type: 'project',
    metadata: {
      title: "Autbot – Educational Chatbot",
      subtitle: "Improving engagement for children with autism using multi-modal emotion recognition.",
      venue: "Project",
      date: "2023",
      themeColor: "#6366f1", // Indigo
      secondaryColor: "#e0e7ff",
    },
    narrative: {
      problem: "Children with autism often find standard educational tools unengaging because these tools fail to recognize or respond to the child's emotional state, leading to frustration.",
      innovation: "Developed a conversational AI using DistilRoBERTa and TensorFlow. The system employs a dual-input architecture analyzing both speech (tone) and text (semantics) to gauge emotion with high fidelity.",
      impact: "Improved engagement by 30% in pilot tests. Achieved over 90% accuracy in speech-based emotion recognition and 73% in text-based recognition, adjusting responses to the child's feelings."
    },
    visuals: {
      diagramType: 'confidence-meter'
    },
    technical: {
      techStack: ["TensorFlow", "DistilRoBERTa", "HuggingFace", "React"],
      codeSnippet: `import tensorflow as tf
from transformers import TFDistilBertModel

# Multi-Modal Model Architecture
def build_dual_model():
    # 1. Text Input (BERT)
    text_input = tf.keras.layers.Input(shape=(max_len,), dtype=tf.int32, name='text')
    bert_layer = TFDistilBertModel.from_pretrained('distilbert-base-uncased')
    text_embedding = bert_layer(text_input)[0][:, 0, :]
    
    # 2. Audio Input (Spectrogram CNN)
    audio_input = tf.keras.layers.Input(shape=(128, 128, 1), name='audio')
    conv1 = tf.keras.layers.Conv2D(32, (3,3), activation='relu')(audio_input)
    flat_audio = tf.keras.layers.Flatten()(conv1)
    
    # 3. Fusion Layer
    concatenated = tf.keras.layers.Concatenate()([text_embedding, flat_audio])
    output = tf.keras.layers.Dense(num_emotions, activation='softmax')(concatenated)
    
    return tf.keras.Model(inputs=[text_input, audio_input], outputs=output)`
    },
    authors: [
      { name: "Ishani Kathuria", role: "Project Lead" }
    ]
  }
];

export const resume = {
  education: [
    {
      degree: "Master of Science in Applied Artificial Intelligence. GPA: 4.0/4.0",
      school: "Purdue University Northwest",
      location: "Indiana, USA",
      period: "Aug 2025 – Expected May 2027",
      details: ["Coursework: Generative AI, Ethical AI, Applied Machine Learning, Data Visualization"]
    },
    {
      degree: "Bachelor of Technology in Artificial Intelligence. CGPA: 9.09/10",
      school: "Amity University",
      location: "Uttar Pradesh, India",
      period: "July 2019 – July 2023",
      details: ["Coursework: Deep Learning, Computer Vision, Natural Language Processing"]
    }
  ],
  experience: [
    {
      role: "AI Research Assistant",
      company: "Center for Cybersecurity, Purdue University",
      period: "Sept 2025 – Present",
      details: [
        "Conducting research on Retrieval Augmented Generation (RAG) pipelines, focusing on retrieval quality, hallucination reduction, and latency optimization for LLM-based systems."
      ]
    },
    {
      role: "Software Development Engineer",
      company: "Amazon Web Services",
      period: "March 2025 – July 2025",
      details: [
        "Contributed to internal AI-assisted debugging workflows leveraging LLM-based log summarization and retrieval techniques, reducing average debugging time from 2.5 hours to 30 minutes.",
        "Built internal tools to simulate customer interactions, enabling proactive bug detection in microservices and reducing external customer reported issues by 30%.",
        "Designed and deployed AI-powered chatbots for internal tools, guiding operators on command usage and troubleshooting steps; improved operational efficiency by 40%."
      ]
    },
    {
      role: "System Development Engineer",
      company: "Amazon Web Services",
      period: "July 2023 – March 2025",
      details: [
        "Automated region-build processes for 15+ AWS OpenSearch services, reducing manual intervention by 80% and cutting deployment timelines by 3 weeks.",
        "Refactored and optimized domain scripts, cutting CPU and memory utilization by >50%, saving $15,000 monthly and improving query performance.",
        "Collaborated with cross-functional teams to ensure rigorous pre-launch testing, reducing downtime incidents during regional expansions by 25%."
      ]
    },
    {
      role: "Founder",
      company: "Get It Done",
      period: "Oct 2021 – June 2023",
      details: [
        "Founded and led a student-focused AI startup, mentoring 200 students.",
        "Organized workshops leading to 78% of students achieving placements."
      ]
    }
  ],
  skills: {
    ai: ["Generative AI", "RAG", "Agentic AI", "PyTorch", "Tensorflow", "HuggingFace", "Langchain", "Ollama", "Scikit-learn"],
    dev: ["Python", "Golang", "TypeScript", "MATLAB"],
    data: ["Pandas", "NumPy", "Tableau", "Matplotlib", "Seaborn"],
    cloud: ["AWS Bedrock", "Lambda", "ECS", "Step Functions", "CloudFormation", "CloudWatch"],
    web: ["Flask", "Django", "HTML", "CSS", "Bootstrap"],
    certs: ["AWS Certified AI Practitioner", "AWS Certified Cloud Practitioner"]
  }
};
