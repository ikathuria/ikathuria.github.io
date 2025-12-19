
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
      problem: "Children with autism often find standard educational tools unengaging because these tools fail to recognize or respond to the child's emotional state, leading to frustration and disengagement.",
      innovation: "I developed 'Autbot' using DistilRoBERTa and TensorFlow. The key innovation was a dual-input system that analyzes both speech (tone/pitch) and text simultaneously to gauge emotion with higher fidelity.",
      impact: "The system improved user engagement by 30% in pilot tests. It achieved over 90% accuracy in speech-based emotion recognition and 73% in text-based recognition, providing a more empathetic learning partner."
    },
    visuals: {
      diagramType: 'waveform'
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
  },
  {
    id: 'selfmed',
    type: 'project',
    metadata: {
      title: "SelfMed – Medical AI Chatbot",
      subtitle: "Diagnosing diseases and suggesting home remedies using BERT and Transformers.",
      venue: "Project",
      date: "2023",
      themeColor: "#10b981", // Emerald
      secondaryColor: "#d1fae5",
    },
    narrative: {
      problem: "Access to quick, reliable preliminary medical advice is often limited, especially regarding home remedies where information is scattered and unverified.",
      innovation: "I built an NLP-driven chatbot integrating BERT and Transformers via Flask and the Telegram API. The model was trained to specifically map natural language descriptions of symptoms to potential conditions and Indian home remedies.",
      impact: "The chatbot achieved 85% accuracy in symptom-to-condition mapping. Deployed to over 100 users, it successfully reduced dependency on immediate physical consultations by 30% for minor ailments."
    },
    visuals: {
      diagramType: 'network-graph'
    },
    technical: {
      techStack: ["BERT", "Flask", "Telegram API", "Pandas"],
      codeSnippet: `@app.route('/predict', methods=['POST'])
def predict():
    user_input = request.json['message']
    
    # Tokenize input using BERT Tokenizer
    inputs = tokenizer(
        user_input, 
        return_tensors="pt", 
        padding=True, 
        truncation=True
    )
    
    # Inference
    with torch.no_grad():
        logits = model(**inputs).logits
    
    predicted_class_id = logits.argmax().item()
    condition = class_labels[predicted_class_id]
    
    # Fetch Remedy from Database
    remedy = remedies_df.loc[remedies_df['condition'] == condition, 'remedy'].values[0]
    
    return jsonify({'condition': condition, 'remedy': remedy})`
    },
    authors: [
      { name: "Ishani Kathuria", role: "Project Lead" }
    ]
  },
  {
    id: 'signature-verification',
    type: 'project',
    metadata: {
      title: "Offline Signature Verification",
      subtitle: "Detecting forgeries with Siamese Convolutional Neural Networks.",
      venue: "Project",
      date: "2023",
      themeColor: "#64748b", // Slate
      secondaryColor: "#f1f5f9",
    },
    narrative: {
      problem: "Manual signature verification is slow, subjective, and prone to human error, creating security vulnerabilities in banking and legal document processing.",
      innovation: "I implemented a Siamese Convolutional Neural Network (CNN). Unlike standard classification, this architecture learns a 'similarity metric', taking two signatures as input and calculating the distance between their feature vectors to detect forgeries.",
      impact: "The model achieved 90% accuracy on benchmark signature datasets, offering a robust, automated solution for authenticating offline documents."
    },
    visuals: {
      diagramType: 'confidence-meter'
    },
    technical: {
      techStack: ["PyTorch", "Siamese Networks", "Computer Vision", "OpenCV"],
      codeSnippet: `class SiameseNetwork(nn.Module):
    def __init__(self):
        super(SiameseNetwork, self).__init__()
        # Shared CNN layers
        self.cnn = nn.Sequential(
            nn.Conv2d(1, 96, kernel_size=11, stride=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(3, stride=2),
            nn.Conv2d(96, 256, kernel_size=5, stride=1),
            nn.ReLU(inplace=True)
        )
        # Fully connected distance metric
        self.fc = nn.Sequential(
            nn.Linear(256 * 5 * 5, 1024),
            nn.ReLU(inplace=True),
            nn.Linear(1024, 128)
        )

    def forward_once(self, x):
        output = self.cnn(x)
        output = output.view(output.size()[0], -1)
        output = self.fc(output)
        return output

    def forward(self, input1, input2):
        output1 = self.forward_once(input1)
        output2 = self.forward_once(input2)
        return output1, output2`
    },
    authors: [
      { name: "Ishani Kathuria", role: "Project Lead" }
    ]
  },
  {
    id: 'gesture-recognition',
    type: 'project',
    metadata: {
      title: "Depth Gesture Recognition",
      subtitle: "3D CNNs for dynamic hand gesture estimation.",
      venue: "Project",
      date: "2022",
      themeColor: "#f59e0b", // Amber
      secondaryColor: "#fef3c7",
    },
    narrative: {
      problem: "Standard 2D gesture recognition systems often fail in complex lighting or when hands overlap, as they lack depth perception and spatial context.",
      innovation: "I built a 3D Convolutional Neural Network (3D-CNN) using TensorFlow, integrating it with Open3D. This allowed the system to process depth maps alongside RGB data, capturing the 'Z-axis' of movement.",
      impact: "This approach enabled accurate estimation of hand depth and robust detection of dynamic gestures in real-time, suitable for touchless interfaces."
    },
    visuals: {
      diagramType: 'depth-grid'
    },
    technical: {
      techStack: ["TensorFlow", "3D-CNN", "Open3D", "NumPy"],
      codeSnippet: `def create_3d_cnn(input_shape):
    model = Sequential()
    
    # 3D Convolution captures Spatial (X,Y) + Temporal (Depth/Time) features
    model.add(Conv3D(32, kernel_size=(3, 3, 3), activation='relu', input_shape=input_shape))
    model.add(MaxPooling3D(pool_size=(2, 2, 2)))
    
    model.add(Conv3D(64, kernel_size=(3, 3, 3), activation='relu'))
    model.add(MaxPooling3D(pool_size=(2, 2, 2)))
    
    model.add(Flatten())
    model.add(Dense(256, activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(num_classes, activation='softmax'))
    
    return model`
    },
    authors: [
      { name: "Ishani Kathuria", role: "Project Lead" }
    ]
  }
];

export const resume = {
  education: [
    {
      degree: "Master of Science in Applied Artificial Intelligence",
      school: "Purdue University Northwest",
      location: "Indiana, USA",
      period: "Aug 2025 – Present",
      details: ["Current GPA: 4.0/4.0", "Coursework: Generative AI, Ethical AI, Applied ML, Data Visualization"]
    },
    {
      degree: "Bachelor of Technology in Artificial Intelligence",
      school: "Amity University",
      location: "Uttar Pradesh, India",
      period: "July 2019 – July 2023",
      details: ["CGPA: 9.09/10", "Coursework: Deep Learning, Computer Vision, NLP"]
    }
  ],
  experience: [
    {
      role: "AI Research Assistant",
      company: "Center for Cybersecurity, Purdue University",
      period: "Sept 2025 – Present",
      details: [
        "Conducting research on Retrieval Augmented Generation (RAG) pipelines and LLM optimization.",
        "Collaborate with faculty/student teams, presenting results at lab meetings."
      ]
    },
    {
      role: "Software Development Engineer",
      company: "Amazon Web Services (AWS)",
      period: "March 2025 – July 2025",
      details: [
        "Worked on an applied AI service to analyze customer data/logs, reducing debugging time from 2.5h to 30m.",
        "Built internal tools to simulate customer interactions, reducing external reported issues by 30%.",
        "Deployed AI chatbots improving operational efficiency by 40%."
      ]
    },
    {
      role: "System Development Engineer",
      company: "Amazon Web Services (AWS)",
      period: "July 2023 – March 2025",
      details: [
        "Automated region-build processes for 15+ OpenSearch services, reducing manual intervention by 80%.",
        "Optimized scripts cutting CPU/memory utilization by >50%, saving $15,000 monthly.",
        "Collaborated on pre-launch testing, reducing downtime incidents by 25%."
      ]
    },
    {
      role: "Founder",
      company: "Get It Done",
      period: "Oct 2021 – June 2023",
      details: [
        "Founded student-focused AI startup, mentoring 200 students.",
        "Organized workshops leading to 78% of students achieving placements."
      ]
    },
    {
      role: "Previous Internships",
      company: "Various",
      period: "2021 - 2022",
      details: [
        "Planet E-com Solutions: Data & Algorithm Lead",
        "Deloitte: AI Automation Intern",
        "ProfiVe Infotech: Data Mining Intern"
      ]
    }
  ],
  skills: {
    ai: ["PyTorch", "Tensorflow", "HuggingFace", "Langchain", "Ollama", "Scikit-learn", "RAG"],
    dev: ["Python", "Golang", "TypeScript", "MATLAB"],
    data: ["Pandas", "NumPy", "Tableau", "Matplotlib", "Seaborn"],
    cloud: ["Bedrock", "Lambda", "ECS", "Step Functions", "CloudFormation", "CloudWatch"],
    web: ["Flask", "Django", "HTML", "CSS", "Bootstrap"],
    certs: ["AWS Certified AI Practitioner", "AWS Certified Cloud Practitioner"]
  }
};
