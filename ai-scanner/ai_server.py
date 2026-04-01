from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import PyPDF2
import io
import os
import joblib

app = Flask(__name__)
CORS(app)

# AI Model Class
class CertificateAIScanner:
    def __init__(self):
        self.vectorizer = CountVectorizer()
        self.classifier = MultinomialNB()
        
    def train(self):
        training_data = [
            # REAL certificates
            ("This is to certify that Student has completed Bachelor of Technology", 0),
            ("Official academic transcript issued by university registrar", 0),
            ("Degree of Master of Science awarded with distinction", 0),
            ("Indian Institute of Technology - Certificate of Completion", 0),
            ("Bachelor of Engineering from Anna University", 0),
            ("Successfully completed the course with grade A", 0),
            
            # FAKE certificates
            ("Buy fake degree online cheap price instant download", 1),
            ("Free certificate generator get your diploma in 5 minutes", 1),
            ("Fake degree maker no verification needed", 1),
            ("Congratulations you won a certificate click here to claim", 1),
            ("Unverified document from unknown source", 1),
        ]
        
        texts = [item[0] for item in training_data]
        labels = [item[1] for item in training_data]
        
        X = self.vectorizer.fit_transform(texts)
        self.classifier.fit(X, labels)
        
        # Save model
        joblib.dump(self.vectorizer, 'vectorizer.pkl')
        joblib.dump(self.classifier, 'classifier.pkl')
        print("✅ AI Model trained and saved!")
        
    def load_model(self):
        if os.path.exists('vectorizer.pkl'):
            self.vectorizer = joblib.load('vectorizer.pkl')
            self.classifier = joblib.load('classifier.pkl')
            print("✅ AI Model loaded!")
            return True
        return False
    
    def scan(self, text):
        if not hasattr(self, 'classifier') or not self.classifier:
            if not self.load_model():
                self.train()
        
        X = self.vectorizer.transform([text])
        prediction = self.classifier.predict(X)[0]
        probability = self.classifier.predict_proba(X)[0]
        
        fake_score = round(probability[1] * 100, 2)
        real_score = round(100 - fake_score, 2)
        
        return {
            "is_fake": bool(prediction == 1),
            "fake_score": fake_score,
            "real_score": real_score,
            "verdict": "FAKE" if prediction == 1 else "REAL"
        }

# Initialize scanner
scanner = CertificateAIScanner()
scanner.train()

# API Routes
@app.route('/scan-text', methods=['POST'])
def scan_text():
    data = request.get_json()
    text = data.get('text', '')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    result = scanner.scan(text)
    return jsonify(result)

@app.route('/scan-file', methods=['POST'])
def scan_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    
    # Extract text from PDF
    text_content = ""
    if file.filename.endswith('.pdf'):
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file.read()))
        for page in pdf_reader.pages:
            text_content += page.extract_text()
    else:
        text_content = file.read().decode('utf-8', errors='ignore')
    
    if not text_content.strip():
        return jsonify({'error': 'Could not extract text from file'}), 400
    
    result = scanner.scan(text_content)
    result['extracted_text'] = text_content[:300]
    
    return jsonify(result)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'AI Scanner is running', 'model_ready': True})

if __name__ == '__main__':
    print("🚀 Starting AI Scanner Server...")
    print("📍 API available at: http://localhost:5001")
    print("📌 Endpoints:")
    print("   POST /scan-text - Scan certificate text")
    print("   POST /scan-file - Scan PDF file")
    print("   GET  /health   - Check status")
    app.run(port=5001, debug=True)